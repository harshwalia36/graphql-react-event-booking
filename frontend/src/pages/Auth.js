import React, {Component} from 'react';
import './Auth.css';

class AuthPage extends Component {
  state={
      isLogin:true
  };

  switchModeHandler = () =>{
      this.setState(prevState => {
          return {isLogin:!prevState.isLogin};
      });
        
  }

      constructor(props){
          super(props);
          this.emailElem=React.createRef();
          this.passwordElem=React.createRef();
      }

      submitHandler=(event) =>{
          event.preventDefault();
          const email=this.emailElem.current.value;
          const password=this.passwordElem.current.value;

          if(email.trim().length===0||password.trim().length===0)
          return;

          let requestBody={
              query:`
              query {
                  login (email:"${email}",password:"${password}") {
                      userId
                      token
                      tokenExpiration
                  }
              }
              `
          }

          if(!this.state.isLogin)
          {
            requestBody={
                query:`
                mutation {
                    createUser(userinput:{email:"${email}",password:"${password}"}){
                        _id
                        email
                    }
                }`
            };
          }
          
          
          fetch('http://localhost:8000/graphql', {
              method:'POST',    //graphql request are always POST and by default it sends in GET
              body:JSON.stringify(requestBody),
              headers:{
                  'Content-Type':'application/json'  //we tell the backend we are sending data in JSON. so, parse it as json `
              }
          })
          .then(res =>{
              if(res.status!==200 && res.status!==201){
                throw new Error('Failed');
              }
              
              return res.json();
          })
          .then(resData =>{
              console.log(resData);
          })
          .catch(err =>{
              console.log(err);
          });
      }
    render() {
        return(
            <form class='auth-form' onSubmit={this.submitHandler}>
              < div className='form-control'>
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" ref={this.emailElem} />
              </div>
              < div className='form-control'>
                  <label htmlFor="password">Password</label>
                  <input type="password" id="password" ref={this.passwordElem} />
              </div>
              <div className='form-action'>
                  <button type="submit">Submit</button>
                  <button type='button' onClick={this.switchModeHandler}>Switch to {this.state.isLogin ? 'SignUp' : 'Login'}</button>

              </div>
            </form>
        )
    }
}

export default AuthPage;
