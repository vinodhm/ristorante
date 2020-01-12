import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody,
    CardTitle, Breadcrumb, BreadcrumbItem, 
    Button, Row, Col, Label, Modal, ModalHeader, ModalBody  } from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';        
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

function RenderDish({dish}) {
    return(
        <Card width="100%">
            <CardImg top src={dish.image} alt={dish.name} />
            <CardBody>
                <CardTitle>{dish.name}</CardTitle>
                <CardText>{dish.description}</CardText>
            </CardBody>
        </Card>
    );
}

function RenderComments({comments, addComment, dishId}) {
    return(        
        <div>
            {comments.map(comment=>(
                <ul key={comment.id} className='list-unstyled'>
                    <li>{comment.comment}</li>
                    <li>--{comment.author},{new Intl.DateTimeFormat('en-US', {year: 'numeric', month: 'short', day:'2-digit'}).format(new Date(Date.parse(comment.date)))}</li>
                </ul>
            ))}            
            <CommentForm dishId={dishId} addComment={addComment}/>
        </div>
    )
}

class CommentForm extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.state = {            
            isModalOpen: false
        };
    }

    toggleModal() {
        this.setState({
          isModalOpen: !this.state.isModalOpen
        });
    }
    handleSubmit(values) {        
        console.log('Current State is: ' + JSON.stringify(values));
        this.props.addComment(this.props.dishId, values.rating, values.author, values.comment);        
    }
    
    render() {  
        return(
            <div>
            <button className="btn btn-light border border-dark"
                onClick={this.toggleModal}>
                <FontAwesomeIcon icon={faPencilAlt}></FontAwesomeIcon>
                &nbsp; Submit comment
            </button>
            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                <ModalBody>
                    <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                        <Row className="form-group">
                            <Label htmlFor="rating" md={12}> Rating </Label>
                            <Col md={12}>
                                <Control.select model=".rating"
                                                id="rating"
                                                name="rating"
                                                className="form-control">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </Control.select>
                            </Col>
                        </Row>
                        <Row className="form-group">                            
                            <Label htmlFor="author" md={12}>Your Name</Label>
                            <Col md={12}>
                                <Control.text model=".author" id="author" name="author"
                                    placeholder="Your Name"
                                    className="form-control"
                                    validators={{
                                        required, minLength: minLength(3), maxLength: maxLength(15)
                                    }}
                                        />
                                <Errors
                                    className="text-danger"
                                    model=".author"
                                    show="touched"
                                    messages={{
                                        required: 'Required',
                                        minLength: 'Must be greater than 2 characters',
                                        maxLength: 'Must be 15 characters or less'
                                    }}
                                    />
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Label htmlFor="message" md={12}>Comment</Label>
                            <Col md={12}>
                                <Control.textarea model=".comment" id="comment" name="comment"
                                    rows="6"
                                    className="form-control" />
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Col md={{size:12, offset: 0}}>
                                <Button type="submit" color="primary">
                                    Submit
                                </Button>
                            </Col>
                        </Row>
                    </LocalForm>                        
                </ModalBody>
            </Modal>
            </div>
        );
    }
}

const  DishDetail = (props) => {
    if (props.dish != null) {
        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>                
                </div>
                <div className="row">
                    <div className="col-12 col-md-5 m-1">
                        <RenderDish dish={props.dish} />
                    </div>
                    <div className="col-12 col-md-5 m-1">
                        <RenderComments comments={props.comments} addComment={props.addComment}
                                        dishId={props.dish.id}/>                        
                    </div>

                </div>
                <div className="row"></div>
            </div>
        );
    } else {
        return (<div></div>);
    }
}

export default DishDetail;
