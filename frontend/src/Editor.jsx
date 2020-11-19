import react,{Component} from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-vibrant_ink";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/keybinding-vscode";
import axios from "axios";
class Editor extends Component{
    constructor(props){
        super(props);
        this.state={language:"python",code:"",output:"",loading:false};
        this.changer = this.changer.bind(this);
        this.submitCode = this.submitCode.bind(this);
    }
    submitCode(){
        const {code} = this.state;
        const username = "hamzaali";
        const data = {
            code:code,
            username:username
        }
        this.setState({loading:true})
        axios.post("/sendcode",data).then(response=>this.setState({output:response.data.message,error:response.data.error,loading:false}))
    }
    changer(value){
        this.setState({code:value})
    }
    render(){
        // if(this.state.loading){
        //     return <h2>loading</h2>
        // }
        return(
            <div className="main-container">
                 <button id="submit-button" onClick={this.submitCode}>Submit Code</button>
            <div className="editor-container">
                 <AceEditor
                    keyboardHandler="vscode"
                    name="editordiv"
                    mode="python"
                    theme="vibrant_ink"
                    defaultValue="#This is the PyLot code editor."
                    onChange={this.changer}
                    setOptions={{
                        enableBasicAutocompletion:true,
                        enableLiveAutocompletion:true,
                    }}
                    editorProps={{$blockScrolling:true}}
                />
                {this.state.loading
                ?(
                    <div class="preloader-wrapper small active">
                    <div class="spinner-layer spinner-green-only">
                      <div class="circle-clipper left">
                        <div class="circle"></div>
                      </div><div class="gap-patch">
                        <div class="circle"></div>
                      </div><div class="circle-clipper right">
                        <div class="circle"></div>
                      </div>
                    </div>
                  </div>
                )
                :(<p className="code-output" style={{whiteSpace:"pre-line"}}>
                    <span style={{color:"green"}}>{this.state.output}</span>
                    <span style={{color:"red"}}>{this.state.error}</span>
                </p>
                )}
               {/* <p className="code-output" style={{whiteSpace:"pre-line"}}>{this.state.output}</p>  */}
            </div>
            </div>
        )
    }
}
export default Editor;