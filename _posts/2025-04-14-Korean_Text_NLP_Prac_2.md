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

# 한글 텍스트 자연어 처리 실습 1
## 1. 활용 데이터셋 소개
emotion_korTran.data  
출처: <https://cafe.naver.com/nlpk/335>  

## 2. 환경설정 (Google Colab)
### 2.1. 환경설정 진행

```bash
# ✅ 1. KoBERT 환경 설정 (Colab에서 실행 시)
!pip install -q datasets
!pip install -q kss
!pip install -q pandas
!pip install -q matplotlib
!pip install -q transformers
!pip install -q gluonnlp==0.10.0
!pip install -q tqdm
!pip install -q torch
!pip install -q sentencepiece
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

# ✅ 2. 저장된 모델 가중치 불러오기
model.load_state_dict(torch.load("/kobert_emotion_epoch4.pt", map_location=device))  # 파일명 확인
print("✅ 모델 가중치 불러오기 완료")

# ✅ 3. Optimizer, Loss 재설정
optimizer = torch.optim.AdamW(model.parameters(), lr=2e-5)
loss_fn = nn.CrossEntropyLoss()

# ✅ 4. 이어서 학습
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

```python
from google.colab import files

# ✅ 에폭별 모델 저장
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

# 참고
* [전이학습(Transfer learning)과 파인튜닝(Fine tuning)](https://hi-ai0913.tistory.com/32)
* [[Python, KoBERT] 다중 감정 분류 모델 구현하기 (huggingface로 이전 방법 O)](https://hoit1302.tistory.com/159)
* [[KoBERT] SKTBrain의 KoBERT 공부하기](https://nowolver.tistory.com/13)
* [1.허깅페이스란?](https://jaeyoon-95.tistory.com/222)
* [Hugging Face: KoBERT](https://huggingface.co/monologg/kobert)