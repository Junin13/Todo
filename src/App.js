import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Importando o Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput: "", // Valor do input
      list: [], // Lista de tarefas
    };
  }

  componentDidMount() {
    this.fetchTodos(); // Carregar tarefas quando o app iniciar
  }

  // Função para buscar tarefas do back-end
  fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/todos");
      this.setState({ list: response.data });
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // Função para adicionar tarefa
  addItem = async () => {
    if (this.state.userInput.trim()) {
      try {
        const response = await axios.post("http://localhost:5000/todos", {
          value: this.state.userInput,
          completed: false, // Inicialmente as tarefas são não concluídas
        });
        this.setState((prevState) => ({
          list: [...prevState.list, response.data],
          userInput: "", // Limpar o input após adicionar a tarefa
        }));
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  // Função para marcar tarefa como concluída
  toggleComplete = async (id, completed) => {
    try {
      await axios.patch(`http://localhost:5000/todos/${id}`, { completed });
      this.fetchTodos(); // Atualizar lista após a alteração
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Função para excluir tarefa
  deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${id}`);
      this.fetchTodos(); // Atualizar lista após exclusão
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  render() {
    return (
      <Container>
        <Row className="text-center mt-4">
          <h1>TODO LIST</h1>
        </Row>

        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Adicione uma nova tarefa"
                value={this.state.userInput}
                onChange={(e) => this.setState({ userInput: e.target.value })}
              />
              <Button variant="primary" onClick={this.addItem}>
                Add
              </Button>
            </InputGroup>

            <ListGroup className="mt-4">
              {this.state.list.map((item) => (
                <ListGroup.Item
                  key={item.id}
                  style={{
                    textDecoration: item.completed ? "line-through" : "none", // Tarefa concluída terá linha
                  }}
                >
                  <span style={{ marginRight: "15px" }}>{item.value}</span> 
              
                  <span className="float-right">
                    <Button
                      variant="success"
                      onClick={() =>
                        this.toggleComplete(item.id, !item.completed)
                      }
                    >
                      {item.completed ? " Não concluido" : " Concluido"}
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => this.deleteItem(item.id)}
                      style={{ marginLeft: "15px" }}
                    >
                      Deletar
                    </Button>
                  </span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
