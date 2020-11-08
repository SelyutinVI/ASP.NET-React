class User extends React.Component {

    constructor(props) {
        super(props);
        this.state = { data: props.user, edit: false};

        this.onDeleteUser = this.onDeleteUser.bind(this);
        this.onEditUser = this.onEditUser.bind(this);
        this.onSaveChanges = this.onSaveChanges.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onEmailChange = this.onEmailChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
    }

    onDeleteUser() {
        this.props.onRemove(this.state.data);
    }

    onEditUser() {
        this.setState({edit: true})
    }

    onSaveChanges() {
        this.setState({ edit: false })
        console.log(this.state.data.name, this.state.data.email, this.state.data.password);
        this.props.onChanges(this.state.data);
    }

    onNameChange(event) {
        var tdata = this.state.data;
        tdata.name = event.target.value;
        this.setState({ data: tdata });
    }
    onEmailChange(event) {
        var tdata = this.state.data;
        tdata.email = event.target.value;
        this.setState({ data: tdata });
    }
    onPasswordChange(event) {
        var tdata = this.state.data;
        tdata.password = event.target.value;
        this.setState({ data: tdata });
    }

    render() {
        if (!this.state.edit)
            return <div>
                <p><b>{this.state.data.name}</b></p>
                <p>{this.state.data.email}</p>
                <p>{this.state.data.password}</p>
                <p><button onClick={this.onDeleteUser}>Удалить</button> <button onClick={this.onEditUser}>Редактировать</button></p>
            </div>
        else
            return (
                <div>
                <p>
                    <input type="text"
                        placeholder="Имя"
                        value={this.state.data.name}
                        onChange={this.onNameChange}
                        />
                </p>
                <p>
                    <input type="text"
                        placeholder="E-mail"
                        value={this.state.data.email}
                        onChange={this.onEmailChange}
                        />
                </p>
                <p>
                    <input type="text"
                        placeholder="Пароль"
                        value={this.state.data.password}
                        onChange={this.onPasswordChange}
                        />
                </p>
                    <p><button onClick={this.onDeleteUser}>Удалить</button> <button onClick={this.onSaveChanges}>Сохранить</button></p>
                </div>
            );
    }
}



class AddUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = { name: "", email: "", password: "" };

        this.onAddUser = this.onAddUser.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onEmailChange = this.onEmailChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
    }

    onAddUser(event) {
        event.preventDefault();
        var n = this.state.name;
        var e = this.state.email;
        var p = this.state.password;
        if (!n || !e || !p)
            return;
        this.props.onAdd({ name: n, email: e, password: p });
        this.setState({ name: "", email: "", password: "" });
    }

    onNameChange(event) {
        this.setState({ name: event.target.value });
    }
    onEmailChange(event) {
        this.setState({ email: event.target.value });
    }
    onPasswordChange(event) {
        this.setState({ password: event.target.value });
    }

    render() {
        return (
            <div>
                <p>
                    <input type="text"
                        placeholder="Имя"
                        value={this.state.name}
                        onChange={this.onNameChange} />
                </p>
                <p>
                    <input type="text"
                        placeholder="E-mail"
                        value={this.state.email}
                        onChange={this.onEmailChange} />
                </p>
                <p>
                    <input type="text"
                        placeholder="Пароль"
                        value={this.state.password}
                        onChange={this.onPasswordChange} />
                </p>
                <button onClick={this.onAddUser}>Сохранить</button>
            </div>);
    }
}



class UsersList extends React.Component {

    constructor(props) {
        super(props);
        this.state = { users: []};

        this.onAddUser = this.onAddUser.bind(this);
        this.onRemoveUser = this.onRemoveUser.bind(this);
        this.onSaveChangesUser = this.onSaveChangesUser.bind(this);
    }

    loadData() {
        var xhr = new XMLHttpRequest();
        xhr.open("get", this.props.apiUrl, true);
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            this.setState({ users: data });
        }.bind(this);
        xhr.send();
    }
    
    componentDidMount() {
        this.loadData();
    }

    onRemoveUser(user) {
        if (user) {
            var url = this.props.apiUrl + "/" + user.id;

            var xhr = new XMLHttpRequest();
            xhr.open("delete", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onload = function () {
                if (xhr.status === 200) {
                    this.loadData();
                }
            }.bind(this);
            xhr.send();
        }
    }

    onAddUser(user) {
        if (user) {
            const data = new FormData();
            data.append("name", user.name);
            data.append("email", user.email);
            data.append("password", user.password);

            var xhr = new XMLHttpRequest();
            xhr.open("post", this.props.apiUrl, true);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    this.loadData();
                }
            }.bind(this);
            xhr.send(data);
        }
    }

    onSaveChangesUser(user) {
        if (user) {
            const data = new FormData();
            data.append("id", user.id);
            data.append("name", user.name);
            data.append("email", user.email);
            data.append("password", user.password);

            var xhr = new XMLHttpRequest();
            xhr.open("put", this.props.apiUrl, true);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    this.loadData();
                }
            }.bind(this);
            xhr.send(data);
        }
    }

    render() {
        var remove = this.onRemoveUser;
        var add = this.onAddUser;
        var save = this.onSaveChangesUser;
        return <div>
            <h2>Создание нового пользователя</h2>
            <AddUser onAdd={add} />
            <h2>Список пользователей</h2>
            <div>
                {
                    this.state.users.map(function (user) {

                        return <User key={user.id} user={user} onRemove={remove} onChanges={save} />
                    })
                }
            </div>
        </div>;
    }
};


ReactDOM.render(
    <UsersList apiUrl="/api/home" />,
    document.getElementById("content")
);