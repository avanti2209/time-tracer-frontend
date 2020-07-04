/**global chrome */
import React from 'react';
import './App.css';
import Dropdown from './dropdown/dropdown';

function timer(element) {

  function formatValue(input) {
    /**input will be in seconds */
    if (input >= 3600) {
      //more than 1 hour
      const hour = parseInt(input / 3600);
      input = input - (3600 * hour);

      if (input >=60) {
        const min = parseInt(input / 60);
        const secs = input - (60 * min);
        return `${hour > 9 ? hour : `0${hour}`}:${min > 9 ? min : `0${min}`}:${secs > 9 ? secs: `0${secs}`}`;
      }
      return `${hour > 9 ? hour : `0${hour}`}:00:${input > 9 ? input: `0${input}`}`;
    } else if (input >= 60) {
      // more than 1 min
      const min = parseInt(input / 60);
      const secs = input - (60 * min);
      return `00:${min > 9 ? min : `0${min}`}:${secs > 9 ? secs: `0${secs}`}`;
    }

    return `00:00:${input > 9 ? input : `0${input}`}`;
  }

  console.log(element);
  let value = 0;

  let interval = null;

  let updateUI = (input) => {
    if (element) {
      element.innerHTML = formatValue(input);
    } else {
      if (interval) {
        clearInterval(interval);
      }
    }
  }

  let startTimer = () => {
    console.log(value)
    interval = setInterval(
      () => {
        value++;
        updateUI(value);
      },
      990
    );
  }

  let resetTimer = () => {
    value = 0;
    clearInterval(interval);
    interval = null;
    updateUI(value);
  }

  let pauseTimer = () => {
    if (interval) {
      clearInterval(interval);
    }
    return value;
  }

  return {
    interval,
    startTimer,
    resetTimer,
    pauseTimer
  }

}

export default class App extends React.Component {

  constructor() {
    super(...arguments);
    this.state = {
      form: {

      },
      tasks: {
        0: {
          label: '',
          start: 0,
          end: 0,
          labelError: '',
          isCompleted: false
        }
      },
      options: [
        { label: 'AAA', active: false },
        { label: 'BBB', active: false },
        { label: 'CCC', active: false }
      ],
      noOfTask: 0
    }
  }

  startTimer(index) {
    const tasks = { ...this.state.tasks };
    console.log('starting time for ', index + 1, ' task')

    const instance = tasks[index].instance ? tasks[index].instance : new timer(document.getElementById(`tc${index}`));
    instance.startTimer();

    tasks[index] = {
      ...tasks[index],
      start: (new Date()).getTime(),
      instance
    }
    this.setState({
      tasks
    });
  }

  pauseTimer(index) {
    const tasks = { ...this.state.tasks };
    console.log('stopping time for ', index + 1, ' task')
    tasks[index].instance.pauseTimer();
    tasks[index] = {
      ...tasks[index],
      end: (new Date()).getTime()
    }
    console.log(tasks[index].end - tasks[index].start);
    this.setState({
      tasks
    });
  }

  resetTimer(index) {
    const tasks = { ...this.state.tasks };
    console.log('restting time for ', index + 1, ' task')
    tasks[index].instance.resetTimer();
    tasks[index] = {
      ...tasks[index],
      start: 0,
      end: 0
    }
    this.setState({
      tasks
    });
  }

  completeTask(index) {
    const tasks = { ...this.state.tasks };
    console.log('completing time for ', index + 1, ' task')
    tasks[index] = {
      ...tasks[index],
      start: 0,
      end: 0,
      isCompleted: true
    };

    this.setState({
      tasks
    });
  }

  updateTaskLabel(index, event) {
    const value = event.target.value;
    console.log(value);

    const tasks = { ...this.state.tasks };

    tasks[index] = {
      ...tasks[index],
      label: value
    };

    this.setState({
      tasks
    });
  }

  addTask() {
    const tasks = { ...this.state.tasks };
    const newEntry = Object.keys(tasks).length;
    tasks[newEntry] = {
      label: '',
      start: 0,
      end: 0,
      labelError: '',
      isCompleted: false
    };
    this.setState({
      tasks
    });
  }

  submit() {
    console.log('submit is click');
  }

  onEmpIdChange(e) {
    const value = e.target.value;
    this.setState({
      empId: value
    });
  }

  onFormFieldChange(name, event) {
    if (name === 'wbs') {
      this.setState({
        options: event
      });
    } else {
      this.setState({
        form: {
          ...this.state.form,
          [name]: event.target.value
        }
      })
    }
  }

  render() {
    return <div className='app-shell'>

      <header className='header'>
        <h3>Time Tracer</h3>
        <div className='input-field'>
          <input id='empId'
            ref={(node) => { this.empIdRef = node;}}
            onChange={this.onEmpIdChange.bind(this)}
            placeholder="Employee Id" />
        </div>
      </header>


      <section className='new-task-shell'>
        {
          this.state.showForm ?
            <div className='form'>

              <div className='form-fields'>
                <div className='input-field'>
                  <input
                    name="task"
                    type='text'
                    placeholder="Task Name"
                    maxLength="20"
                    onChange={this.onFormFieldChange.bind(this, 'task')}
                  />
                </div>

                <div className='input-field'>
                  <input
                    name="team"
                    type='text'
                    placeholder="Team"
                    maxLength="20"
                    onChange={this.onFormFieldChange.bind(this, 'team')}
                  />
                </div>

                <div className='input-field'>
                  <input
                    name="client"
                    type='text'
                    placeholder="Client"
                    maxLength="20"
                    onChange={this.onFormFieldChange.bind(this, 'client')}
                  />
                </div>

                <div className='input-field'>
                  <Dropdown 
                    name='wbs'
                    placeHolder="WBS"
                    options={this.state.options}
                    onChange={this.onFormFieldChange.bind(this, 'wbs')} />
                </div>

              </div>

              <div className='form-actions'>
                <button className='btn-primary' onClick={this.addTask.bind(this)}>
                  Add Task
                </button>
              </div>

            </div>
            :
            <button className='btn-link'
              onClick={() => {
                this.setState({
                  form: {},
                  showForm: true
                });
              }}>
              Add a new task
            </button>
        }
        
      </section>

      {
        this.state.noOfTask ?
        <section className='task-shell'>
          <h5>Your Tasks</h5>
          {
            Object.values(this.state.tasks).map((task, index) => {
              return <div className='task' key={index}>
                <div className='task-view'>
                  <div className='input-field'>
                    <input
                      id={`task${index}`}
                      type='text'
                      placeholder={`Task ${index}`}
                      value={task.label}
                      onChange={this.updateTaskLabel.bind(this, index)}
                    />
                  </div>
                  <div className='task-counter' id={`tc${index}`}>
                    00:00:00
                  </div>
                </div>
                <div className='actions'>
                  <span onClick={this.startTimer.bind(this, index)}>Start</span>
                  <span onClick={this.pauseTimer.bind(this, index)}>Pause</span>
                  <span onClick={this.resetTimer.bind(this, index)}>Reset</span>
                  <span onClick={this.completeTask.bind(this, index)}>Complete</span>
                </div>
              </div>
            })
          }
        </section>
        :
        null
      }

      <div className='footer'>
        {
          this.state.noOfTask ?
            <button className='btn-primary' onClick={this.submit.bind(this)}>
              Submit Tasks
            </button>
            :
            null
        }
        <button className='btn-link' onClick={this.addTask.bind(this)}>
          Update Old Task?
        </button>
      </div>
      
    </div>
  }
}