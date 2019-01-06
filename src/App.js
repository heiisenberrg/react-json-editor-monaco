import React, { Component } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main';
import beautify from 'js-beautify';
import jsonlint from 'jsonlint';
import jsonminify from 'jsonminify';
import './App.css';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
       error: null
    };
  }
  componentDidMount() {
    this.createMonacoEditor();
  }

  createMonacoEditor() {
    if (this.containerElement) {
        const options = {
          minimap: {enabled: false},
          colorDecorators: true,
          glyphMargin: true,
          wordWrap: 'wordWrapColumn',
          wordWrapColumn: 80,
          EditorAutoClosingStrategy: "always",
          scrollbar: { verticalScrollbarSize: 8,
            useShadows: false,
            verticalSliderSize: 8,
            readOnly: true
           }
        };

        monaco.editor.defineTheme('myTheme', {
          base: 'vs',
          inherit: true,
          rules: [{ background: '000000' }],
          colors: {
              'editor.foreground': '#000000',
              'editor.background': '#ffffff',
              'editorCursor.foreground': '#8B0000',
              'editor.lineHighlightBackground': '#0000FF20',
              'editorLineNumber.foreground': '#000000',
              'editor.selectionBackground': '#88000030',
              'editor.inactiveSelectionBackground': '#88000015'
          }
      });

        this.editor = monaco.editor.create(this.containerElement, {
          language: 'json',
          value: '{}',
          theme: 'myTheme',
          ...options
        });

        this.editor.deltaDecorations([], [
          { 
            range: new monaco.Range(2, 1, 2, 1),
            options: { 
              isWholeLine: true, 
              className: 'myContentClass',

			        linesDecorationsClassName: 'myGlyphMarginClass'
           }
          }
        ]);

        this.editor.revealPositionInCenter({ lineNumber: 2, column: 3 });
    }
  }

  assignRef = (component) => {
    this.containerElement = component;
  }

  validate() {
    // const content = this.refs.monaco.editor.getValue();
    const content = '';
    try {
      const value = jsonminify(content);
      if (this.trigger) {
        this.trigger = false;
        this.editor.setValue(beautify.js_beautify(value));
        this.trigger = true;
      }
      jsonlint.parse(beautify.js_beautify(value));
    } catch (err) {
      const array = err.message.match(/line ([0-9]*)/);
      // this.editor.deltaDecorations([], [
      //   { range: new monaco.Range(parseInt(array[1], 10), 1, parseInt(array[1], 10), 1), options: { isWholeLine: true, linesDecorationsClassName: 'myLineDecoration' }}
      // ]);
      // this.setState({
      //   error: [err]
      // });
    }
  }

  render() {
    return (
      <div className="container-fluid">
        <div class="card">
          <div class="card-header display-flex">
              <div className="col-md-6">
                <h5>JSON Editor</h5>
              </div>
              <div className="col-md-6 actions display-flex">
                <button className="btn btn-primary" onClick={this.validate()}>Validate</button>
                <div className='upload-btn'>
                  <input type='file' multiple='false'/>
                  <button className="btn btn-success">Upload</button>
                </div>
              </div>
          </div>
          <div class="card-body">
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
              <strong>Holy guacamole!</strong> You should check in on some of those fields below.
              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
           </div>
           <div id="code" data-lang="json" ref={this.assignRef} className="react-monaco-editor-container" />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
