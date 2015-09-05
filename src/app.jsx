// Detect whether there is a need for browserify
var React = require('react');
var $ = require('jquery');

var TodoForm = React.createClass({

  handleFormSubmit: function(e) {
    e.preventDefault();
    var inputEl = React.findDOMNode(this.refs.inputText);

    this.props.handleFormSubmit(inputEl.value.trim());

    inputEl.value = "";
  },

  render: function() {
    return (
      <form className="todo--form" onSubmit={this.handleFormSubmit}>
        <label for="todo__input">Add a new task</label>
        <input name="todo__input" type="text" placeholder="I need to..." ref="inputText"
        />
        <input type="submit" value="Add" />
      </form>
    );
  }
});


var TodoItem = React.createClass({
  handleCheckedClick: function() {
    this.props.handleCheckedClick(this.props.index);
  },

  render: function() {
    return (
      <li className="todo--item">
        <div className="todo__completed">
          <input type="checkbox" checked={this.props.todo.completed}
            onChange={this.handleCheckedClick}
          />
        </div>
        <div className="todo__details">
          <div className="todo__task">
            {this.props.todo.task}
          </div>
          <div className="todo__due">
          </div>
        </div>
      </li>
    );
  }
});

var TodoCount = React.createClass({
  render: function() {

    var todoCount = this.props.todos.length;
    var incompleteCount = this.props.todos.filter(function(todo) {
      return !todo.completed;
    }).length;

    return (
      <div className="todo-count">
        {todoCount} items total, <strong>{incompleteCount} incomplete tasks</strong>
      </div>
    );
  }
});

var TodoList = React.createClass({
  render: function() {

    var todoNodes = this.props.todos.map(function(todo, index) {
      return <TodoItem key={index} todo={todo} index={index} handleCheckedClick={this.props.handleItemCheckedClick} />
    }.bind(this));

    if (todoNodes.length == 0) {
      todoNodes = <li className="todo--item"><div className="todo__task">No task. Yay!</div></li>;
    }

    return (
      <ul className="todo--list">
        {todoNodes}
      </ul>
    );
  }
});

var TodoBox = React.createClass({

  getDefaultProps: function() { return {
    updateDelay: 5000
  }; },

  getTodosDataFromServer: function() {
    $.ajax({
      url: "/todos.json",
      success: function(data) {
        console.log(data);
        this.setState({
          todosData: data["todosData"]
        });
      }.bind(this)
    });
  },

  getInitialState: function() { return {
    todosData: [],
  }; },

  componentDidMount: function() {
    this.getTodosDataFromServer();
    window.setInterval(this.getTodosDataFromServer, this.props.updateDelay);
  },

  addNewTask: function(task) {
    var newData = this.state.todosData;
    newData.push({ task: task, completed: false });
    this.setState({
      todosData: newData
    });
  },

  updateChecked: function(index) {
    var newData = this.state.todosData;
    newData[index].completed = !newData[index].completed;
    this.setState({
      todosData: newData
    });
  },

  render: function() {
    return (
      <div className="todo--box">
        <TodoCount todos={this.state.todosData} />
        <TodoList todos={this.state.todosData} handleItemCheckedClick={this.updateChecked} />
        <TodoForm handleFormSubmit={this.addNewTask} />
      </div>
    );
  }
});

React.render(
  <TodoBox />,
  document.getElementById('mountPoint')
);
