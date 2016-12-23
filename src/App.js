import Inferno from 'inferno';
import Component from 'inferno-component';
import {TinyMCE} from './lib/components/TinyMCE';
import Logo from './logo';
import './App.css';

class App extends Component {

    handleEditorChange = (e) => {
        console.log('Content was updated:', e.target.getContent());
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <Logo width="80" height="80"/>
                    <h2>Welcome to Inferno</h2>
                </div>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
                <div className="editor">
                    <TinyMCE
                        config={{
                            height: 300,
                            plugins: 'link image code',
                            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
                        }}
                        onChange={this.handleEditorChange}
                    />
                </div>
            </div>
        );
    }
}

export default App;
