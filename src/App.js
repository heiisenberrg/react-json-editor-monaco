import React, { Component } from 'react';
import logo from './logo.svg';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main';
import beautify from 'js-beautify';
import jsonlint from 'jsonlint';
import jsonminify from 'jsonminify';
import './App.css';

// "vs" | "vs-dark" | "hc-black" themes
class App extends Component {
  
  componentDidMount() {
    this.initMonaco();
  }

  initMonaco() {
    if (this.containerElement) {
        const options = {
          minimap: {enabled: false},
          extraEditorClassName: 'ttttt',
          colorDecorators: true,
          glyphMargin: true,
          wordWrap: 'wordWrapColumn',
          wordWrapColumn: 80,
          EditorAutoClosingStrategy: "always",
          // autoClosingQuotes: 'always'
          scrollbar: { verticalScrollbarSize: 8,
            useShadows: false,
            verticalSliderSize: 8,
            readOnly: true
            // verticalHasArrows: true
           }

          // glyphMargin: true
        };

        this.editor = monaco.editor.create(this.containerElement, {
          formatOnPaste: true,
          formatOnType: true,
          language: 'json',
          value: '{}',
          theme: 'hc-black',
          ...options
        });

        // monaco.editor.colorizeElement(document.getElementById('code'));
        this.editor.deltaDecorations([], [
          { 
            range: new monaco.Range(2, 1, 2, 1),
            options: { 
              isWholeLine: true, 
              className: 'myContentClass',
			        glyphMarginClassName: 'myGlyphMarginClass'
           }
          }
        ]);

        this.editor.revealPositionInCenter({ lineNumber: 2, column: 3 });
      // monaco.editor.setTheme('ace');
      // this.editorDidMount(this.editor);
    }
  }

  assignRef = (component) => {
    this.containerElement = component;
  }

  editorDidMount(editor) {
    // editor.onDidChangeModelContent((event) => {
      // monaco.editor.colorizeElement(document.getElementById('code'));
      //   const content = editor.getValue();
    //   if (this.state.isEditContent) {
    //     try {
    //       const value = jsonminify(content);
    //       if (this.trigger) {
    //         this.trigger = false;
    //         this.editor.setValue(beautify.js_beautify(value));
    //         this.trigger = true;
    //       }
    //       jsonlint.parse(beautify.js_beautify(value));
    //     } catch (err) {
    //       const array = err.message.match(/line ([0-9]*)/);
    //       this.editor.deltaDecorations([], [
    //         { range: new monaco.Range(parseInt(array[1], 10), 1, parseInt(array[1], 10), 1), options: { isWholeLine: true, linesDecorationsClassName: 'myLineDecoration' }}
    //       ]);
    //       this.editor.setModelMarkers(this.editor.getModel(), 'test', [{
    //         endColumn: 1000,
    //         endLineNumber: parseInt(array[1], 10),
    //         message: 'error',
    //         severity: this.editor.Severity.Error,
    //         startColumn: 1,
    //         startLineNumber: parseInt(array[1], 10)
    //     }]);
    //       this.setState({
    //         error: [err]
    //       });
    //     }
    //   }
    // });
  }
  render() {
    const style = {
      height: 600,
      width: 800
    };
    return (
      <div id="code" data-lang="json" ref={this.assignRef} style={style} className="react-monaco-editor-container" />
    );
  }
}

export default App;
