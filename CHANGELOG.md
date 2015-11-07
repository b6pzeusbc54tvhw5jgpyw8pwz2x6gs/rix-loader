
## 0.2.0
upgrade dependency to react-inline version 0.8.1!!
upgrade dependency to babel version 6 !!


## 0.1.3
webpack.config.js 개선 - webpack 에서 css 파일 번들도 동시에 지원.


## 0.1.1
이제 context option 을 얻기 위해 해당 파일을 모두 실행하지 않고, 오직 rixContext 라는 함수만 따로 추출하여 실행시킵니다. 따라서 rixContext 함수 로직은 함수 스코프 안에서만 이루어져야합니다.(함수 밖을 참조하는 자바스크립트 클로져 사용불가).

이런 방향은 외부 모듈을 사용하여 동적인 CSS를 생성하는 것을 불가능하게 합니다. 하지만 전통적인 CSS의 역할이나 CSS Preprocessor 들의 역할을 볼때 하나의 컴포넌트를 위한 CSS Rule 정의는 그 컴포넌트 안에서 해결 하는 것이 복잡도를 줄이고 전통적인 CSS 사용패턴과 충돌하지 않는다고 생각합니다. 외부 컴포넌트를 참조하여 스타일 변경을 할 일이 있다면 CSS Rule 자체가 매번 동적으로 바뀌는 것보다 React 컴포넌트에서 동적으로 className 을 변경해주거나 inline style 값을 변경하는 것이 바람직합니다.

Now doesn't resolve file's dependency.
Only call rixContext function

Base features are alright. But it is needed more test.

## 0.1.0
Base features are alright. But it is needed more test.

## 0.0.8
change dependency

## 0.0.8
Add example

## 0.0.4
Use react-inline-for-webpack-loader temporarily
