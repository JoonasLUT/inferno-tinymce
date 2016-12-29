# Inferno TinyMCE

Inferno TinyMCE component

## Installing

```bash
$ npm install --save inferno-tinymce
```

## Example

```js
import Inferno from 'inferno';
import Component from 'inferno-component';
import TinyMCE from 'inferno-tinymce';

class App extends Component {
  handleEditorChange = (e) => {
    console.log('Content was updated:', e.target.getContent());
  }

  render() {
    return (
      <TinyMCE
        config={{
          plugins: 'autolink link image lists print preview',
          toolbar: 'undo redo | bold italic | alignleft aligncenter alignright'
        }}
        onChange={this.handleEditorChange}
      />
    );
  }
}

Inferno.render(<App/>, document.getElementById('root'));
```

## Dependency

This component depends on `tinymce` being globally accessible.

```html
<script src="//cdn.tinymce.com/4/tinymce.min.js"></script>
```

OR

Download TinyMCE Community: https://www.tinymce.com/download/

## Configuration

TinyMCE Docs: https://www.tinymce.com/docs/

## License

MIT