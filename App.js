import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Animated } from 'react-native';
import Task from './components/Task';

const ToDoApp = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [removedCompletedTasks, setRemovedCompletedTasks] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const fadeAnim = new Animated.Value(1);

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), text: task, completed: false }]);
      setTask('');
    }
  };

  const removeTask = (id) => {
    const taskToRemove = tasks.find((item) => item.id === id);
    if (taskToRemove && taskToRemove.completed) {
      setRemovedCompletedTasks([...removedCompletedTasks, taskToRemove]);
    }
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setTasks(tasks.filter((item) => item.id !== id));
    });
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deletePermanently = (id) => {
    setRemovedCompletedTasks(removedCompletedTasks.filter((item) => item.id !== id));
  };

  const filteredTasks = showCompleted ? removedCompletedTasks : tasks;

  const renderTask = ({ item }) => (
    <Task
      item={item}
      fadeAnim={fadeAnim}
      toggleComplete={toggleComplete}
      removeTask={removeTask}
      deletePermanently={deletePermanently} // Pass delete function for removed tasks
      showCompleted={showCompleted}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Add a task..."
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>



      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#343a40',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 18,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#17a2b8',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ToDoApp;
