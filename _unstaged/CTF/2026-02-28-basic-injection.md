# Basic Injection

## Vuln

SSTI

## Code

```js
// import
const express = require('express');
const ejs = require('ejs');

// 앱 시작
const app = express();

// url 인코딩과 json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => {
    // username과 settings을 쿼리로 받음
    const { username, settings } = req.query;
    
    // username이 없다면
    if (!username) {
        return res.send('Missing param');
    }
    
    // template에 username을 직접 집어넣음
    try {
        const template = '<h1>Welcome <%= username %>!</h1>';
        
        // 쿼리값 setting으로 option 설정
        let opts = {};
        if (settings) {
            try {
                opts = JSON.parse(settings);
            } catch (e) {
                opts = {};
            }
        }
        
        // 템플릿에 
        let result;
        try {
            result = ejs.render(template, { username }, opts);
        } catch (renderError) {
            result = renderError.toString();
        }
        
        // 결과 35자 제한
        const limit = result.toString().slice(0, 35);
        
        res.send(limit);
    } catch (error) {
        const errorMsg = error.toString().slice(0, 35);
        res.status(500).send(errorMsg);
    }
});

const PORT = 5000;
app.listen(PORT, () => {
});
```

## Payload

## 참고

- [Tistory: CVE-2022-29078 ejs(3.1.6) - outputFunctionName Injection Vulnerability](https://hg2lee.tistory.com/entry/CVE-2022-29078-ejs316-outputFunctionName-Injection-Vulnerability)
- [Tistory: ejs 3.1.6 ssti](https://minpo.tistory.com/198)
- [Github Pages: CVE-2022-29078 EJS SSTI RCE](https://dyrandy.github.io/posts/2022/10/31/cve-2022-29078-ejs-ssti-rce/)
- [Tistory: EJS Server Side Template Injection 취약점 [CVE-2022-29078]](https://one3147.tistory.com/65)
- [Github: EJS, Server side template injection ejs@3.1.9 Latest #720](https://github.com/mde/ejs/issues/720)
- [Blog: EJS Vulnerabilities in CTF](https://blog.huli.tw/2023/06/22/en/ejs-render-vulnerability-ctf/)
