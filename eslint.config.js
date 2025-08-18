// ESLint 설정 파일 - 코드 품질 및 스타일 검사 규칙 정의
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // 기본 JavaScript 규칙 적용
  js.configs.recommended,
  // TypeScript 권장 규칙 적용
  ...tseslint.configs.recommended,
  {
    // 언어 옵션 설정
    languageOptions: {
      // ECMAScript 2020 버전 사용
      ecmaVersion: 2020,
      // 전역 변수 정의 (브라우저 환경 + ES2020)
      globals: {
        ...globals.browser,  // window, document 등 브라우저 전역 변수
        ...globals.es2020,   // ES2020 전역 변수 (Promise, Map 등)
      },
      // 파서 옵션 설정
      parserOptions: {
        ecmaFeatures: {
          jsx: true,  // JSX 문법 지원
        },
      },
    },
    // 플러그인 설정
    plugins: {
      'react-hooks': reactHooks,      // React Hooks 규칙 검사
      'react-refresh': reactRefresh,   // Fast Refresh 지원
    },
    // 규칙 설정
    rules: {
      // React Hooks 권장 규칙 적용
      ...reactHooks.configs.recommended.rules,
      // Fast Refresh 규칙 - 컴포넌트 내보내기 제한
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },  // 상수 내보내기 허용
      ],
    },
  },
  {
    // 무시할 파일/폴더 설정
    ignores: ['dist', '.eslintrc.cjs'],
  }
); 