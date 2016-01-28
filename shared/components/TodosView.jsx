import React         from 'react';
import { PropTypes } from 'react';
import Immutable     from 'immutable';

export default class TodosView extends React.Component {
    static propTypes = {
        todos: PropTypes.instanceOf(Immutable.List).isRequired,
        editTodo: PropTypes.func.isRequired,
        deleteTodo: PropTypes.func.isRequired,
        doneTodo: PropTypes.func.isRequired
    };

    handleDelete = (e) => {
        const id = Number(e.target.dataset.id);

        this.props.deleteTodo(id);
    };

    handleDone = (e) => {
        const id = e.target.dataset.id;
        const index = Number(e.target.dataset.index);
        const done = e.target.checked;
        this.props.doneTodo(id, index, done);
    };

    handleEdit = (e) => {
        const id = Number(e.target.dataset.id);
        const currentVal = this.props.todos.get(id);

        // For a cutting edge UX
        let text = window.prompt('', currentVal);

        this.props.editTodo(id, text);
    };

    render() {
        const btnStyle = {
            'margin': '1em 0 1em 1em'
        };

        return (
            <div id="todos-list">
                {
                    this.props.todos.map(function (todo, index) {
                        let r = !todo.get;
                        let t = {
                            _id: r ? todo._id : todo.get('_id'),
                            todo: r ? todo.todo : todo.get('todo'),
                            done: r ? todo.done || false : todo.get('done') || false
                        };
                        return (
                            <div style={btnStyle} key={t._id}>
                                <input type="checkbox" data-index={index} data-id={t._id} checked={t.done} onChange={this.handleDone}/>
                                <span>{t.todo}</span>
                                <button style={btnStyle} data-index={index} data-id={t._id} onClick={this.handleEdit}>Edit</button>
                                <button style={btnStyle} data-index={index} data-id={t._id} onClick={this.handleDelete}>X</button>
                            </div>
                        );
                    }.bind(this))
                }
            </div>
        );
    }
}
