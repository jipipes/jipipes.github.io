---
title: "[Error] 블로그 배포 후 변경 사항 적용 안됨"
excerpt: 원인이 되는 브라우저 캐시에 대하여

categories:
    - Error
tags:
    - [Error, Web]

toc: true
toc_sticky: true

date: 2025-05-28
last_modified_at: 2025-05-28
---

깃헙 블로그 배포 후 변경사항이 적용되지 않는 문제가 있다.
강력 새로고침(캐시 새로고침, Ctrl+F5)을 하니 해결되어 원인을 찾아보기로 한다.

### 캐시[Cache]
> Browser는 CSS, JS, 이미지와 같은 웹사이트 자원을 빠르게 로드하기 위해 로컬에 캐시 해둔다.     
> 여기서 Cache란 자주 사용하는 데이터나 값을 미리 복사해 놓는 임시 장소를 말한다.    
> SSD/HDD, Main Memory 보다 저장 공간이 작지만 빠른 성능을 제공한다. (~~비용이 비싸다~~)  
  
블로그를 수정하더라도, 파일 이름이 그대로면 브라우저는 '같은 파일'로 인식하는 것이 원인이다.   
수정을 했어도 브라우저는 예전 버전을 보여주게 된다.   
  
따라서 해결방법은 다음과 같다   
1. 파일명 또는 쿼리스트링 추가   
* 파일명에 해시 자동 추가   
&emsp; 변경될 때마다 다른 이름으로 인식되어 캐시를 무시하고 새로 로드되도록 함   
&emsp; ex. 'image.css'를 'image.css?v=2' 처럼 파일 버전명 혹은 빌드시 'image.8a3f.css'처럼 파일명에 해시 자동 추가   
2. 브라우저 캐시 무효화 설정   
* 서버에서 HTTP 헤더 설정으로 캐시 무효화   
```http
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```   
&emsp; 정적 사이트의 경우 '.htaccess', 'vercel.json' 등으로 설정이 가능하다.   
3. 배포 자동화 도구 사용   
* Hugo, Jekyll, Next.js 처럼 정적 사이트 생성기들은 빌드시 자동으로 파일에 해시를 붙임    

&emsp; 나의 경우 Jekyll기반이지만 Github pages는 정적 파일을 그대로 서빙하므로, CSS나 JS파일명이 바뀌지 않으면 브라우저가 예전 파일을 계속 캐시해서 불러온 것   
&emsp; jekyll-assets 플러그인을 통해 파일 이름에 해시를 자동으로 붙여 해결하기로 한다.



