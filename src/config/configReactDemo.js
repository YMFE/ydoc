module.exports = {
    "destDir": "react-docs",
    "template_react":"./template/template_react.html",
    "project": {
        "title": "React-docs",
        "footer": "Made By Qunar Hotel FE Mobile Team.",
        "banner": {
            "title": "React-Native",
            "description": "A FRAMEWORK FOR BUILDING NATIVE APPS USING REACT"
        },
        "modules": [
            {
                "title": "QUICK START",
                "blocks": [
                    {   
                        "type":"markdown",
                        "title": "Getting Started",
                        "content": "./docs/GettingStarted.md"
                    },
                    {
                        "type":"markdown",
                        "title": "Android Setup",
                        "content": "./docs/DevelopmentSetupAndroid.md"
                    }
                ]
            }, 
            {
                "title": "GUIDES",
                "blocks": [
                    { 
                        "type":"markdown",
                        "title": "Style",
                        "content": "./docs/GettingStarted.md"
                    },
                    {
                        "type":"markdown",
                        "title": "Images",
                        "content": "./docs/GettingStarted.md"
                    }
                ]
            },
            {
                "title": "COMPONENTS",
                "blocks": [
                    {
                        "type":"js",
                        "title": "View",
                        "content": "./Libraries/Components/View/View.js"
                    },
                    {
                        "type":"js",
                        "title": "ActivityIndicatorIOS",
                        "content": "./Libraries/Components/ActivityIndicatorIOS/ActivityIndicatorIOS.ios.js"
                    }
                ]
            },
            {
                "title": "API",
                "blocks": [
                    {
                        "type":"js",
                        "title": "ActionSheetIOS",
                        "content": "./Libraries/ActionSheetIOS/ActionSheetIOS.js"
                    },
                    {
                        "type":"js",
                        "title": "Alert",
                        "content": "./Libraries/Utilities/Alert.js"
                    }
                ]
            }
        ]
    },
    "version": "0.0.1"
}