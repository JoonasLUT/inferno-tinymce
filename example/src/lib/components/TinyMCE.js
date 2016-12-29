import Inferno from 'inferno';
import Component from 'inferno-component';
import uuid from '../helpers/uuid';
import ucFirst from '../helpers/ucFirst';

// Include all of the Native DOM and custom events from:
// https://github.com/tinymce/tinymce/blob/master/tools/docs/tinymce.Editor.js#L5-L12
const EVENTS = [
    'focusin', 'focusout', 'click', 'dblclick', 'mousedown', 'mouseup',
    'mousemove', 'mouseover', 'beforepaste', 'paste', 'cut', 'copy',
    'selectionchange', 'mouseout', 'mouseenter', 'mouseleave', 'keydown',
    'keypress', 'keyup', 'contextmenu', 'dragend', 'dragover', 'draggesture',
    'dragdrop', 'drop', 'drag', 'BeforeRenderUI', 'SetAttrib', 'PreInit',
    'PostRender', 'init', 'deactivate', 'activate', 'NodeChange',
    'BeforeExecCommand', 'ExecCommand', 'show', 'hide', 'ProgressState',
    'LoadContent', 'SaveContent', 'BeforeSetContent', 'SetContent',
    'BeforeGetContent', 'GetContent', 'VisualAid', 'remove', 'submit', 'reset',
    'BeforeAddUndo', 'AddUndo', 'change', 'undo', 'redo', 'ClearUndos',
    'ObjectSelected', 'ObjectResizeStart', 'ObjectResized', 'PreProcess',
    'PostProcess', 'focus', 'blur', 'dirty'
];

// Note: because the capitalization of the events is weird, we're going to get
// some inconsistently-named handlers, for example compare:
// 'onMouseleave' and 'onNodeChange'
const HANDLER_NAMES = EVENTS.map((event) => {
    return 'on' + ucFirst(event);
});

export default class TinyMCE extends Component {

    constructor(props) {
        super(props);

        this._isInit = false;
        this._textArea = null;
        this._refTextArea = this._refTextArea.bind(this);
    }

    _refTextArea(node) {
        this._textArea = node;
    }

    componentWillMount() {
        this.id = this.id || this.props.id || uuid();
    }

    componentDidMount() {
        const config = Object.assign({}, this.props.config);
        this._init(config);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.config !== nextProps.config) {
            this._init(nextProps.config);
        }
        if (this.props.id !== nextProps.id) {
            this.id = nextProps.id;
        }
    }

    shouldComponentUpdate(nextProps) {
        return (
            this.props.config !== nextProps.config
        );
    }

    componentWillUnmount() {
        this._remove();
    }

    render() {
        return this.props.config.inline ? (
            <div
                ref={this._refTextArea}
                id={this.id}
                className={this.props.className}
            />
        ) : (
            <textarea
                ref={this._refTextArea}
                id={this.id}
                className={this.props.className}
            />
        );
    }

    _init(config) {
        if (this._isInit) {
            this._remove();
        }

        // hide the textarea that is me so that no one sees it
        this._textArea.style.hidden = 'hidden';

        const setupCallback = config.setup;
        const hasSetupCallback = (typeof setupCallback === 'function');

        config.selector = '#' + this.id;
        config.setup = (editor) => {
            EVENTS.forEach((event, index) => {
                const handler = this.props[HANDLER_NAMES[index]];
                if (typeof handler !== 'function') return;
                editor.on(event, (e) => {
                    // native DOM events don't have access to the editor so we pass it here
                    handler(e, editor);
                });
            });
            if (hasSetupCallback) {
                setupCallback(editor);
            }
        };

        tinymce.init(config);

        this._textArea.style.hidden = '';

        this._isInit = true;
    }

    _remove() {
        tinymce.EditorManager.execCommand('mceRemoveEditor', true, this.id);
        this._isInit = false;
    }
}
