---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[DATA SCIENCE] 한글 텍스트 자연어 처리 실습 2"
excerpt: "한글 텍스트 자연어 처리: 소설 속 등장인물 감정 흐름 변화 추적"

date: 2025-04-13
last_modified_at: 

categories: [DATA SCIENCE]
tags: [DATA SCIENCE, NLP, TIL]
---

# 목차
1. [활용 데이터셋 소개](#1-활용-데이터셋-소개)
1. [환경설정 (Google Colab)](#2-환경설정-google-colab)
    1. [환경설정 진행](#21-환경설정-진행)
    1. [라이브러리 import](#22-라이브러리-import)
1. [데이터 전처리하기](#3-데이터-전처리하기)
    1. [데이터 로드 및 전처리](#31-데이터-로드-및-전처리)
    1. [감정 label 인코딩](#32-감정-label-인코딩)
1. [모델 학습 준비하기](#4-모델-학습-준비하기)
    1. [tokenizer 및 모델 불러오기](#41-tokenizer-및-모델-불러오기)
    1. [Dataset 클래서 정의하기](#42-dataset-클래서-정의하기)
    1. [train/validation 분할 및 DataLoader 준비하기](#43-trainvalidation-분할-및-dataloader-준비하기)
    1. [분류기 모델 정의하기](#44-분류기-모델-정의하기)
1. [모델 학습하기](#5-모델-학습하기)
1. [모델 저장하기](#6-모델-저장하기)
1. [참고](#참고)

# 한글 텍스트 자연어 처리 실습 2
## 1. 활용 데이터셋 소개
emotion_korTran.data  
출처: [Naver Cafe - nlp study: 감정분석과 감정분석 말뭉치](https://cafe.naver.com/nlpk/335)

## 2. 환경설정 (Google Colab)
### 2.1. 환경설정 진행

```bash
# 단일 데이터셋을 다루기 위한 클래스
!pip install -q datasets
# 한글 문장 분리기
!pip install -q kss
!pip install -q pandas # 데이터 분석
!pip install -q matplotlib # 데이터 시각화
!pip install -q transformers # transformer 모델
!pip install -q gluonnlp==0.10.0
# 진행 상황 표시 모듈
!pip install -q tqdm
!pip install -q torch
!pip install -q sentencepiece
# Open Neural Network Exchange, 플랫폼 간의 모델을 교환해 사용할 수 있게 하는 모듈
!pip install -q onnxruntime
```

### 2.2. 라이브러리 import

```python
# 모듈 임포트
import pandas as pd
import torch
from torch import nn
from torch.utils.data import Dataset, DataLoader
from transformers import BertTokenizer
from tqdm.notebook import tqdm
from transformers import AutoTokenizer, AutoModel
```

## 3. 데이터 전처리하기
### 3.1. 데이터 로드 및 전처리
.data -> DataFrame

```python
data_path = "/emotion_korTran.data"

data = []
with open(data_path, "r", encoding="utf-8") as f:
    next(f)  # 첫 줄 건너뜀 (헤더)
    for line in f:
        line = line.strip()
        if not line:
            continue
        id_text = line.rsplit(",", 1)  # 오른쪽에서부터 마지막 콤마 기준으로 분할
        if len(id_text) == 2:
            idx_text, label = id_text
            idx, text = idx_text.split(",", 1)
            data.append((int(idx), text, label))

df = pd.DataFrame(data, columns=["id", "text", "label"])
```

전처리 된 데이터
![Image](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-04-14-1.png?raw=true.png)

### 3.2. 감정 label 인코딩

```python
label_map = {
    'joy': 0,
    'sadness': 1,
    'anger': 2,
    'fear': 3,
    'love': 4,
    'surprise': 5
}

df['label'] = df['label'].map(label_map)
```

## 4. 모델 학습 준비하기
### 4.1. tokenizer 및 모델 불러오기

```python
tokenizer = AutoTokenizer.from_pretrained("monologg/kobert")
base_model = AutoModel.from_pretrained("monologg/kobert")
```

### 4.2. Dataset 클래서 정의하기

```python
class EmotionDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_len=64):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_len = max_len

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        encoding = self.tokenizer(
            self.texts[idx],
            padding='max_length',
            truncation=True,
            max_length=self.max_len,
            return_tensors="pt"
        )
        item = {key: val.squeeze(0) for key, val in encoding.items()}
        item["labels"] = torch.tensor(self.labels[idx])
        return item
```

### 4.3. train/validation 분할 및 DataLoader 준비하기

```python
from sklearn.model_selection import train_test_split

# train과 validation을 9:1로 나눔
train_texts, val_texts, train_labels, val_labels = train_test_split(
    df["text"], df["label"], test_size=0.1, random_state=42
)

train_dataset = EmotionDataset(train_texts.tolist(), train_labels.tolist(), tokenizer)
# 학습 데이터 일부만 추출 (10%만) <- Colab 런타인 시간 내 학습이 완료되어야 함
data_size = len(train_dataset)
sampled_dataset = torch.utils.data.Subset(train_dataset, range(data_size//10, data_size // 10 * 2))

val_dataset = EmotionDataset(val_texts.tolist(), val_labels.tolist(), tokenizer)

train_loader = DataLoader(sampled_dataset, batch_size=32, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=32)
```

### 4.4. 분류기 모델 정의하기

```python
class KoBERTClassifier(nn.Module):
    def __init__(self, bert, num_classes=6):
        super(KoBERTClassifier, self).__init__()
        self.bert = bert
        self.classifier = nn.Linear(bert.config.hidden_size, num_classes)

    def forward(self, input_ids, attention_mask=None, token_type_ids=None):
        outputs = self.bert(
            input_ids=input_ids,
            attention_mask=attention_mask,
            token_type_ids=token_type_ids
        )
        pooled = outputs.pooler_output
        return self.classifier(pooled)
```

## 5. 모델 학습하기

```python
device = torch.device("cuda" if torch.cuda.is_available() else "cpu") # GPU 있으면 GPU 사용함.

model = KoBERTClassifier(base_model).to(device)
optimizer = torch.optim.AdamW(model.parameters(), lr=2e-5)
loss_fn = nn.CrossEntropyLoss()

# 저장된 모델 가중치 불러오기
model.load_state_dict(torch.load("/kobert_emotion_epoch4.pt", map_location=device))  # 파일명 확인
print("모델 가중치 불러오기 완료")

# Optimizer, Loss 재설정
optimizer = torch.optim.AdamW(model.parameters(), lr=2e-5)
loss_fn = nn.CrossEntropyLoss()

# 이어서 학습
EPOCHS = 1  # 추가로 학습할 에폭 수
start_epoch = 4  # 이어서 시작할 에폭 번호

for epoch in range(start_epoch, start_epoch + EPOCHS):
    model.train()
    total_loss = 0

    for batch in tqdm(train_loader):
        input_ids = batch['input_ids'].to(device)
        attention_mask = batch['attention_mask'].to(device)
        token_type_ids = batch['token_type_ids'].to(device)
        labels = batch['labels'].to(device)

        optimizer.zero_grad()
        outputs = model(input_ids, attention_mask, token_type_ids)
        loss = loss_fn(outputs, labels)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()

    avg_loss = total_loss / len(train_loader)
    print(f"[Epoch {epoch}] Loss: {avg_loss:.4f}")
```

## 6. 모델 저장하기
colab은 12시간마다 런타임이 끊기기 때문에 epoch별로 학습된 모델을 저장해줬다.

```python
from google.colab import files

# 에폭별 모델 저장
model_path = f"/kobert_emotion_epoch{epoch+1}.pt"
drive_path = f"/{model_path}"

# 로컬에 저장
torch.save(model.state_dict(), model_path)

# model 다운로드
files.download(model_path)

# Google Drive로 복사
!cp {model_path} {drive_path}
print(f"모델 저장 완료: {drive_path}")
```

## 7. 모델 평가하기

```python
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 1. 모델 구조 다시 정의 (기존과 동일하게)
model = KoBERTClassifier(base_model).to(device)

# 2. 저장된 가중치 불러오기
model_path = "/content/drive/MyDrive/Colab Notebooks/NLP/models/kobert_emotion_epoch8.pt"
model.load_state_dict(torch.load(model_path, map_location=device))

# 3. 평가 모드로 전환
model.eval()
```

```python
from sklearn.metrics import accuracy_score

def evaluate_accuracy(model, dataloader, tokenizer, sample_texts=None):
    model.eval()
    preds = []
    true_labels = []
    sample_outputs = []

    with torch.no_grad():
        for batch in tqdm(dataloader):
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            token_type_ids = batch['token_type_ids'].to(device)
            labels = batch['labels'].to(device)

            outputs = model(input_ids, attention_mask, token_type_ids)
            predictions = torch.argmax(outputs, dim=1)

            preds.extend(predictions.cpu().numpy())
            true_labels.extend(labels.cpu().numpy())

            # 샘플 출력용 텍스트 복원
            if sample_texts and len(sample_outputs) < 10:
                texts = sample_texts[len(sample_outputs):len(sample_outputs)+len(predictions)]
                for text, pred, true in zip(texts, predictions, labels):
                    sample_outputs.append((text, pred.item(), true.item()))
                    if len(sample_outputs) == 10:
                        break

    acc = accuracy_score(true_labels, preds)
    print(f"✅ Validation Accuracy: {acc * 100:.2f}%\n")
```

```python
evaluate_accuracy(model, val_loader, tokenizer)
```

![그림](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-04-20-1.png?raw=true.png)

## 8. 해리포터 소설에 감정 분석 모델 적용하기

```python
# 해리포터 소설 불러오기
with open("해리포터_통합본_전처리.txt", "r", encoding="utf-8") as f:
    texts = f.read().split('\n')

# 해리포터 전권을 챕터별로 구분
chapters = []
chapter_titles = []
chapter = []
chapter_length = []
cnt = 0

chapter_titles.append(texts[0])
for i in range(1, len(texts)):
    if texts[i].strip():
        if re.match(r'제\s*\d+\s*장\s*[^\n]*\n?', texts[i]):
            chapter_titles.append(texts[i])
            chapters.append(chapter)
            chapter = []
            chapter_length.append(cnt)
            cnt = 0
        else:
            chapter.append(texts[i])
            cnt += 1
```

```python
def predict_emotion(sentence, model, tokenizer):
    model.eval() # 평가 모드로 변경

    encoding = tokenizer(
        sentence,
        return_tensors='pt',
        padding='max_length',
        truncation=True,
        max_length=64
    )

    input_ids = encoding['input_ids'].to(device)
    attention_mask = encoding['attention_mask'].to(device)
    token_type_ids = encoding.get('token_type_ids', torch.zeros_like(input_ids)).to(device)

    with torch.no_grad():
        output = model(input_ids, attention_mask, token_type_ids)
        prediction = torch.argmax(output, dim=1).item()

    label_map_reverse = {
        0: '기쁨', 1: '슬픔', 2: '분노', 3: '불안', 4: '사랑', 5: '놀람'
    }

    return label_map_reverse[prediction]
```

```python
import pandas as pd
from tqdm import tqdm

for i, chapter in enumerate(zip(chapter_titles, chapters)):
    title = chapter[0]
    sentences = chapter[1]
    results = []

    for sentence in tqdm(sentences, desc=f"'{title}' 감정 분석 중"):
        emotion = predict_emotion(sentence, model, tokenizer)
        results.append({
            "sentence": sentence,
            "emotion": emotion
        })

    # DataFrame으로 변환
    df = pd.DataFrame(results)

    # CSV 파일로 저장 (예: chapter_01.csv)
    filename = f"{title}.csv"
    df.to_csv(filename, index=False, encoding='utf-8-sig')  # 윈도우 한글 호환
    print(f"✅ 저장 완료: {filename}")
```

## 9. 감정 분석 결과 시각화

```python
# 사용할 감정 라벨
emotion_labels = ['기쁨', '슬픔', '분노', '불안', '놀람', '사랑']

# 각 감정의 극성 점수 (valence)
emotion_score = {
    '기쁨': 3, '사랑': 2, '놀람': 1,
    '불안': -1, '슬픔': -2, '분노': -3
}
```

평균값은 (감정 극성값 * 빈도수)의 합 / 전체 문장 수
```python
# 감정 극성 평균값을 기반으로 흐름만 시각화
def emotion_avg_score_flow(emotion_df):
    plt.figure(figsize=(12, 6))

    x = [f'{i+1}장' for i in range(len(emotion_df))]
    y = emotion_df['avg_emotion_score']

    plt.plot(x, y, marker='o', color='darkblue', label='평균 감정 점수')

    plt.title("감정 극성 점수의 평균치 흐름")
    plt.xlabel("챕터")
    plt.ylabel("평균 감정 점수")
    plt.axhline(0, color='gray', linestyle='--', linewidth=1)
    plt.xticks(rotation=45)

    plt.legend()
    plt.tight_layout()
    plt.show()
```

```python
# 평균 감정 점수의 분포를 히스토그램으로 시각화
def emotion_score_histogram(emotion_df):
    plt.figure(figsize=(12, 6))

    plt.hist(emotion_df['avg_emotion_score'], bins=10, color='steelblue', edgecolor='black')

    plt.title("평균 감정 점수 분포")
    plt.xlabel("평균 감정 점수")
    plt.ylabel("챕터 갯수")
    plt.axvline(0, color='gray', linestyle='--', linewidth=1)

    plt.tight_layout()
    plt.show()
```

```python
def emotion_frequency_flow(emotion_df):
    # 3. 감정 흐름 시각화
    plt.figure(figsize=(12, 6))

    for label in emotion_labels:
        x = [f'{i+1}장' for i in range(len(emotion_df))]
        y = emotion_df[label]
        plt.plot(x, y, marker='o', label=label)

    plt.title("챕터별 감정 빈도수")
    plt.xlabel("챕터")
    plt.ylabel("감정별 문장 갯수")
    plt.xticks(rotation=45)

    plt.legend()
    plt.tight_layout()
    plt.show()
```

```python
def emotion_focus_chapter(emotion_df):
    # 감정별 집중 챕터 TOP 3 추출
    top_chapters_by_emotion = {}
    for label in emotion_labels:
        top_chapters = emotion_df[['chapter', label]].sort_values(by=label, ascending=False).head(3)
        top_chapters_by_emotion[label] = top_chapters.reset_index(drop=True)
    
    return top_chapters_by_emotion
```

```python
def analyze_emotion_structure(folder_path):
    chapter_emotions = []

    # 각 챕터 파일에서 감정 통계 집계
    for filename in sorted(os.listdir(folder_path)):
        if filename.endswith(".csv"):
            filepath = os.path.join(folder_path, filename)
            df = pd.read_csv(filepath)
            chapter_name = filename.replace(".csv", "")

            # 감정 빈도 수 계산
            emotion_counts = df['emotion'].value_counts().to_dict()
            row = {'chapter': chapter_name}
            total = 0
            score_sum = 0

            for label in emotion_labels:
                count = emotion_counts.get(label, 0)
                row[label] = count
                total += count
                score_sum += emotion_score.get(label, 0) * count

            row['total'] = total
            row['avg_emotion_score'] = score_sum / total if total > 0 else 0
            chapter_emotions.append(row)

    # 데이터프레임 생성
    emotion_df = pd.DataFrame(chapter_emotions)
    emotion_df = emotion_df.sort_values('chapter').reset_index(drop=True)
    emotion_df.fillna(0, inplace=True)

    # 그래프 시각화
    emotion_avg_score_flow(emotion_df)
    emotion_frequency_flow(emotion_df)
    emotion_score_histogram(emotion_df)

    # 특정 감정 많은 챕터 추출
    top_chapters_by_emotion = emotion_focus_chapter(emotion_df)

    return emotion_df, top_chapters_by_emotion
```

```python
for (path, dirs, files) in os.walk('/content/drive/MyDrive/Colab Notebooks/NLP/data_set/emotion_predict'):
  for dir in sorted(dirs):
    folder_path = path + '/' + dir  # 각 챕터 감정 CSV 폴더 경로
    emotion_df, top_chapters_by_emotion = analyze_emotion_structure(folder_path)
    # 감정 구조 분석 결과
    print(emotion_df.head())
    # 예: '분노' 감정이 집중된 챕터 Top 3
    print(top_chapters_by_emotion['분노'])
  break
```

## 10. 결과
### 1권
![그림](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-04-20-3.png?raw=true.png)
![그림](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-04-20-4.png?raw=true.png)
![그림](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-04-20-5.png?raw=true.png)

### 2권
![그림](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-04-20-6.png?raw=true.png)
![그림](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-04-20-7.png?raw=true.png)
![그림](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-04-20-8.png?raw=true.png)

### 3권
![그림](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-04-20-9.png?raw=true.png)
![그림](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-04-20-10.png?raw=true.png)
![그림](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-04-20-11.png?raw=true.png)

### 4권
![그림](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-04-20-12.png?raw=true.png)
![그림](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-04-20-13.png?raw=true.png)
![그림](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-04-20-14.png?raw=true.png)

### 5권
![그림](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-04-20-15.png?raw=true.png)
![그림](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-04-20-16.png?raw=true.png)
![그림](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-04-20-17.png?raw=true.png)

### 6권
![그림](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-04-20-18.png?raw=true.png)
![그림](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-04-20-19.png?raw=true.png)
![그림](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-04-20-20.png?raw=true.png)

### 7권
![그림](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-04-20-21.png?raw=true.png)
![그림](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-04-20-22.png?raw=true.png)
![그림](https://cdn.jsdelivr.net/gh/aliquis-facio/aliquis-facio.github.io@master/_image/2025-04-20-23.png?raw=true.png)

# 참고
* [Dataset.map](https://velog.io/@gsgh3016/Dataset.map)
* [[RN] ONNX(Open Neural Network Exchange) 이해하기 -1: React Native 활용](https://adjh54.tistory.com/203)
* [전이학습(Transfer learning)과 파인튜닝(Fine tuning)](https://hi-ai0913.tistory.com/32)
* [[Python, KoBERT] 다중 감정 분류 모델 구현하기 (huggingface로 이전 방법 O)](https://hoit1302.tistory.com/159)
* [[KoBERT] SKTBrain의 KoBERT 공부하기](https://nowolver.tistory.com/13)
* [1.허깅페이스란?](https://jaeyoon-95.tistory.com/222)
* [Hugging Face: KoBERT](https://huggingface.co/monologg/kobert)
* [[인지과학] 사람의 감정을 어떻게 정의할 수 있을까?](https://steemit.com/kr-science/@man-in-the-moon/5sboad)
* [[Python] 히트맵 그리기 (Heatmap by python matplotlib, seaborn, pandas)](https://rfriend.tistory.com/419)