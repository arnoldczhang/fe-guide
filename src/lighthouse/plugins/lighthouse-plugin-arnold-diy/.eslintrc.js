module.exports = {
    "env": {
        "node": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [                             // 缩进一个tab
            "error",
            2
        ],
        "linebreak-style": [                    // 语句末尾换行
            "error",
            "unix"
        ],
        "quotes": [                             // 一律单引号
            "error",
            "single"
        ],
        "semi": [                               // 语句末尾加分号
            "error",
            "always"
        ],
        "no-console": 0
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "sourceType": "module",
        "allowImportExportEverywhere": false,
        "codeFrame": false
    },
    "globals": {
        "__DEBUG__": false,
        "getApp": false,
        "App": false,
        "Page": false,
        "wx": false,
        "Component":false,
        "getCurrentPages": false
    }
};