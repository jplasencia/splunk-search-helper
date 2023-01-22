let commentLines="```"

setTimeout(() => {

    if(document.querySelector(".ace_editor") != null){
            let editor = ace.edit(document.querySelector(".ace_editor"))
            let showLineNumbers = false
            let ranges
            let settings = JSON.parse(localStorage.getItem("SplunkCommentSettings"))

            if(settings.enableLineCut){
                editor.commands.addCommand({
                    name: "cutLineOnCtrlX",
                    bindKey: {win: "Ctrl-x", mac: "Command-x"},
                    exec: function(editor) {
                        var cursorPosition = editor.getCursorPosition();
                        var range = editor.getSelectionRange();
                        var session = editor.getSession();
                        // If there is no selection, get the text for the whole line
                        if(range.end.column == range.start.column){
                        // Get the row number of the active line
                            var cursorPosition = editor.getCursorPosition();
                            var activeLine = cursorPosition.row;
                            var selectedText = session.getLine(activeLine);
                            editor.removeLines(cursorPosition.row, 1);
                            // But if there is a selection, get only the selected text
                        }else{
                            var selectedText = editor.getSelectedText();
                            // Replace the selected text with an empty string
                            session.replace(range, "");
                
                        }
                        // Set the clipboard with the result from above
                        navigator.clipboard.writeText(selectedText);
                
                    },
                    readOnly: false
                });
            }
// Show help shortcut
            if(settings.enableShowHelp){
                editor.commands.addCommand({
                    name: "showHelpDown",
                    bindKey: {win: "Ctrl-Space", mac: "Command-Space"},
                    exec: function(editor) {
                            showHelp()
                    },
                    readOnly: false
                });
    
            }
// Show line numbers
            if(settings.enableShowLineNumbers){
                editor.commands.addCommand({
                    name: "toggleShowLineNumbers",
                    bindKey: {win: "Ctrl-l", mac: "Command-l"},
                    exec: function(editor) {
                        showLineNumbers = !showLineNumbers
                        editor.renderer.setShowGutter(showLineNumbers);
                        editor.renderer.setOption('showLineNumbers', showLineNumbers);
                    },
                    readOnly: false
                });
            }

// Enable comments
            if(settings.enableComments){
                editor.commands.addCommand({
                    name: "toggleCommentLines",
                    bindKey: {win: "Ctrl-/", mac: "Command-/"},
                    exec: function(editor) {

                        // Get the current cursor position
                        var cursorPosition = editor.getCursorPosition();

                        // Handle when the current line is a comment
                        if(lineIsComment(editor)){
                            // If the current line is a comment, it helps to start from the middle of the line, so let's move it there.
                            var lineText = editor.session.getLine(cursorPosition.row);
                            editor.navigateTo(cursorPosition.row,Math.floor(lineText.length/2))
                            // Replace the backticks at the beginning
                            var searchOptions = {
                                backwards: true,
                                wrap: true,
                                caseSensitive: false,
                                wholeWord: false,
                                regExp: true
                            };
                            editor.find('```', searchOptions);
                            editor.session.replace(editor.selection.getRange(), "")
                    
                            // Replace the backticks at the end
                            var searchOptions = {
                                backwards: false,
                                wrap: true,
                                caseSensitive: false,
                                wholeWord: false,
                                regExp: true
                            };
                            editor.find('```', searchOptions);
                            editor.session.replace(editor.selection.getRange(), "")
                            return
                        }


                        let lines = [];
                        ranges = editor.selection.getAllRanges();
                        var lineCount = editor.session.getLength()
                        var start = ranges[0].start.row + 1;
                        var end = ranges[0].end.row + 1;
                        var sameLine = lineCount-1 == ranges[0].end.row;
                        var appendChart = sameLine ? "" : "\n"

                        for (let i = start-1; i < end; i++) {
                        lines.push(editor.session.getLine(i))
                        
                        }
                            if(lines[0].includes(commentLines)){
                                lines[0] = lines[0].replaceAll(commentLines,'');
                                lines[lines.length-1] = lines[lines.length-1].replaceAll(commentLines,'') + appendChart;
                                
                            }else{
                                lines[0] = commentLines + lines[0];
                                lines[lines.length-1] = lines[lines.length-1] + commentLines + appendChart
                            }
                    
                    // If there's only one line selected, select the line
                    if(ranges[0].start.row == ranges[0].end.row){
                        editor.selection.selectLine() 
                    }else{
                        // Otherwise select a range of lines
                        editor.selection.setRange({start: {row: ranges[0].start.row}, end: {row: ranges[0].end.row+1}},20)
                    }

                    // Replace the selected lines to the modified version
                    editor.session.replace(editor.selection.getRange(), lines.join("\n"))
                    // Move cursor to the end of selected lines
                    editor.selection.moveTo(ranges[0].end.row,20000);
                    

                },
                readOnly: false
            });

    }


    } // end 

}, 5000);


function showHelp(){
    document.querySelector('.search-assistant-activator').click()

}

// Detect if line is a comment
function lineIsComment(editor) {
    var session = editor.getSession();
    
    var cursor = editor.getCursorPosition();
    var token = session.getTokenAt(cursor.row, cursor.column);
    
    return token.type === "comment"

}


function selectCommentLine(editor){
    
    var searchString = "```";
    var searchOptions = {
        backwards: true,
        wrap: true,
        caseSensitive: false,
        wholeWord: false,
        regExp: true
    };
    var starts = editor.find(searchString, searchOptions);

    var searchOptions = {
        backwards: false,
        wrap: true,
        caseSensitive: false,
        wholeWord: false,
        regExp: true
    };
    var ends = editor.find(searchString, searchOptions);
    editor.selection.setRange({start: {row: starts.start.row}, end: {row: ends.end.row+1}},-1) 
    return {start: starts.start.row, end: ends.end.row+1}
}




function findAndReplace(editor,searchFor,replaceWith,backwards){
        var searchOptions = {
                                backwards: backwards,
                                wrap: false,
                                caseSensitive: false,
                                wholeWord: false,
                                regExp: true
                            };

        editor.find(searchFor, searchOptions);
        editor.session.replace(editor.selection.getRange(), replaceWith)
}