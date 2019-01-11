import React, { Component } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main';
import beautify from 'js-beautify';
import jsonlint from 'jsonlint';
import jsonminify from 'jsonminify';
import upload from './upload-button.svg';
import loader from './loader.gif';
import './App.css';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
       error: [],
       decoration: null,
       loading: false,
       isError: false,
       isValid: false
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
          roundedSelection: false,
          scrollBeyondLastLine: false,
          folding: true,
          foldingStrategy: "auto",
          glyphMargin: true,
          wordWrap: 'wordWrapColumn',
          wordWrapColumn: 60,
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
        monaco.editor.setTheme('myTheme');
        monaco.languages.registerDocumentFormattingEditProvider('json', {
          async provideDocumentFormattingEdits(model, options, token) {
            const text = beautify.js_beautify(jsonminify(model.getValue()));
            return [
              {
                range: model.getFullModelRange(),
                text,
              },
            ];
          },
        });
        this.editor = monaco.editor.create(this.containerElement, {
          language: 'json',
          value: '{}',
          ...options
        });

        this.editorDidMount(this.editor);

    }
  }

  componentDidUpdate() {
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
    monaco.editor.setTheme('myTheme');
  }

  assignRef = (component) => {
    this.containerElement = component;
  }

  handleSelect = (event) => {
    event.persist();
    this.setState({
      loading: true
    }, () => {
      setTimeout(() => {
        const fileReader = new FileReader();
        fileReader.onload = this.loadJsonFromSelectedFile;
        fileReader.readAsText(event.target.files[0]);  
      }, 100);
    });
      
  }

  loadJsonFromSelectedFile = (event) => {
    try {
      const target = event.target.result;
      const value = jsonminify(target);
      this.editor.setValue(beautify.js_beautify(value));
      jsonlint.parse(beautify.js_beautify(value));
      this.setState({
        loading: false,
        isError: false,
        isValid: true
      });
    } catch (err) {
      const array = err.message.match(/line ([0-9]*)/);
      this.editor.deltaDecorations([], [
        { 
          range: new monaco.Range(parseInt(array[1], 10), 1, parseInt(array[1], 10), 1),
          options: { 
            isWholeLine: true, 
            className: 'myContentClass',
            linesDecorationsClassName: 'myGlyphMarginClass'
         }
        }
      ]);
      const { index } = array;
      this.editor.revealPositionInCenter({ lineNumber: parseInt(array[1], 10), column: index });
      this.setState({
        error: [err],
        isError: true,
        loading: false,
        isValid: false
      });
    }
  }
 
  validate = () => {
    const content = this.editor.getValue();
    if (Boolean(Object.keys(content).length)) {
      try {
        const value = jsonminify(content);
        this.editor.setValue(beautify.js_beautify(value));
        jsonlint.parse(beautify.js_beautify(value));
        this.setState({
          loading: false,
          isError: false,
          isValid: true
        });
      } catch (err) {
        const array = err.message.match(/line ([0-9]*)/);
        const decoration = this.editor.deltaDecorations([], [
          { 
            range: new monaco.Range(parseInt(array[1], 10), 1, parseInt(array[1], 10), 1),
            options: { 
              isWholeLine: true, 
              className: 'myContentClass',
              linesDecorationsClassName: 'myGlyphMarginClass'
           }
          }
        ]);
        const { index } = array;
        this.editor.revealPositionInCenter({ lineNumber: parseInt(array[1], 10), column: index });
        this.setState({
          error: [err],
          decoration,
          isError: true,
          loading: false,
          isValid: false
        });
      }
    }
  }

  editorDidMount(editor) {
    editor.onDidChangeModelContent((event) => {
      const content = editor.getValue();
      if (Boolean(Object.keys(content).length)) {
        try {
          const value = jsonminify(content);
          if (this.trigger) {
            this.trigger = false;
            this.editor.setValue(beautify.js_beautify(value));
            this.trigger = true;
          }
          jsonlint.parse(beautify.js_beautify(value));
          const decoration = this.editor.deltaDecorations(this.state.decoration, []);
          this.setState({
            loading: false,
            error: [],
            decoration,
            isError: false,
            isValid: true
          });
        } catch (err) {
          const array = err.message.match(/line ([0-9]*)/);
          const decoration = this.editor.deltaDecorations([], [
            { 
              range: new monaco.Range(parseInt(array[1], 10), 1, parseInt(array[1], 10), 1),
              options: { 
                isWholeLine: true, 
                className: 'myContentClass',
                linesDecorationsClassName: 'myGlyphMarginClass'
             }
            }
          ]);
          const { index } = array;
          this.editor.revealPositionInCenter({ lineNumber: parseInt(array[1], 10), column: index });
          this.setState({
            error: [err],
            decoration,
            isError: true,
            loading: false,
            isValid: false
          });
        }
      }
    });
  }

  toggleAlert = () => {
    this.setState({
      isError: !this.state.isError
    })
  }

  render() {
    const { loading, error, isError, isValid } = this.state;
    return (
      <div className="container-fluid">
        <div className="card">
          <div className="card-header display-flex">
              <div className="col-md-6">
                <div className="h5">JSON Editor
                  { isValid && 
                    <span class="badge badge-secondary">Valid JSON</span> 
                  }
                </div>
              </div>
              <div className="col-md-6 actions display-flex">
                <button className="btn btn-primary" onClick={this.validate}>Validate</button>
                <div className='upload-btn'>
                  <input
                    accept=".json"
                    type='file' 
                    multiple={false}
                    onChange={(e) => this.handleSelect(e)}
                  />
                  <button className="btn btn-success display-flex">
                    <div className="upload-icon">
                      <img src={upload} className="upload-img" alt=''/>
                    </div>
                    Upload</button>
                </div>
              </div>
          </div>
          <div className="card-body">
            { isError && 
              <div className="alert alert-warning alert-dismissible fade show" role="alert">
                <p>{error[0].message}</p>
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true" onClick={this.toggleAlert}>×</span>
                </button>
              </div>
            }
            { loading &&
              <div className={loading ? 'loader-main' : 'display-none'}>
                <img style={{marginTop: '25%', height: '100px'}} src={loader} alt='' />
              </div >
            }
            <div
              id="code"
              data-lang="json"
              ref={this.assignRef}
              className='react-monaco-editor-container border'
              />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
