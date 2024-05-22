// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'

const JISHO_URL = 'https://jisho.org'

function openExternal(url: string) {
    vscode.env.openExternal(vscode.Uri.parse(url))
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    // console.log('Congratulations, your extension "jisho" is now active!');

    let disposable = vscode.commands.registerCommand(
        'jisho.navigateToJisho',
        (args) => {
            const activeEditor = vscode.window.activeTextEditor
            if (!activeEditor) {
                return
            }

            const selection = activeEditor.selection
            // Navigate to Jisho if selection is empty
            if (!selection || selection.isEmpty) {
                openExternal(JISHO_URL)
                return
            }

            // Get selected text -> https://stackoverflow.com/a/73044114
            const range = new vscode.Range(selection.start, selection.end)
            const selectedText = activeEditor.document.getText(range)

            // Sourced from the Jisho Chrome Extension
            let url = JISHO_URL + '/search/' + selectedText.trim()
            //  If this is a single kanji character, append #kanji to the URL
            //  to navigate directly to the kanji page
            if (/^[\u4e00-\u9faf]$/.test(selectedText)) {
                url = url + '%23kanji'
            }

            openExternal(url)
        }
    )

    context.subscriptions.push(disposable)
}

// This method is called when your extension is deactivated
export function deactivate() {}
