import React from 'react';
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import "./InputArea.css";
import ImageIcon from '@material-ui/icons/Image';
import IconButton from "@material-ui/core/IconButton";
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import { PostActions } from '../../actions/posts.actions';
import { connect } from 'react-redux';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import inputReducer from "../../reducers/InputReducer";

class InputArea extends React.Component {
    constructor(props) {
        super(props);
        this.textArea = React.createRef();
        this.state = {
            content: "",
            selectedImage: null
        };
    }

    clearAll = () => {
        this.setState({
            content: "",
        });
        this.textArea.current.value = "";
    };

    handleSubmit = () => {
        if (this.state.content) {
            this.props.submitPost({
                userId: this.props.userId,
                content: this.state.content,
                date: new Date(),
                tags: []
            });
            this.clearAll();
        }
    }

    handleChange = (e) => {
        this.setState({
            content: e.target.value,
        });
    };

    imageChangeHandler = (e) => {
        this.setState({
            selectedImage: e.target.files[0]
        });
        if (e.target.files[0].name) {
            const data = new FormData();
            data.append('SomeImage', e.target.files[0], e.target.files[0].name);
            this.imageUploadHandler(data);
        }
    };

    imageUploadHandler = (data) => {
        this.props.uploadImage(data);
    };

    render() {
        return (
            <div className="container">
                <Card className="input-area my-3">
                    <div className="row">
                        <div className="col-lg-2">
                            <Avatar aria-label="avatar" className="input-area-avatar mx-3 my-3">
                                R
                            </Avatar>
                        </div>
                        <div className="col-lg-10">
                            <textarea className="text-box mx-2 mt-3"
                                rows="3"
                                placeholder="What's up?"
                                value={this.props.input}
                                required
                                onChange={(e) => { this.handleChange(e) }}
                                ref={this.textArea}>

                            </textarea>
                            <input className="hide" style={{ display: 'none' }} type="file" ref={'file-upload'} onChange={this.imageChangeHandler} />
                            <ButtonBase
                                onClick={e => {
                                    this.refs['file-upload'].click()
                                }}
                            >
                                <IconButton aria-label="upload image" >
                                    <ImageIcon />
                                </IconButton>
                            </ButtonBase>


                            <IconButton aria-label="add emoji">
                                <EmojiEmotionsIcon />
                            </IconButton>
                            <button type="button"
                                className={"btn btn-primary float-right mx-4 mb-3"
                                    + (this.state.content ? "" : " disabled")}
                                onClick={this.handleSubmit}>
                                Submit
                            </button>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userId: state.userinfo.userId
    };
}

const mapAction = {
    submitPost: PostActions.submitPost,
    likePost: PostActions.likePost,
    uploadImage: PostActions.uploadImage,
}

export default connect(mapStateToProps, mapAction)(InputArea);
