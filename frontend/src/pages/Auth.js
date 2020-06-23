import React, {Component} from 'react';
import AuthContext from '../context/auth-context';
import './Auth.css';

class AuthPage extends Component {
  state={
      isLogin:true
  };

  //we consume the context here(it provides this.context method to get the Default svalue)
  static contextType=AuthContext;

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
              console.log(resData.data);
              if(resData.data.login.token)
              {
                  this.context.login(resData.data.login.token,resData.data.login.userId,resData.data.login.tokenExpiration);
                  console.log('user created');
              }
             
          })
          .catch(err =>{
              console.log(err);
          });
      }
    
    render() {
        return(
            <React.Fragment>
               <h1 className="headingAuth">
            {this.state.isLogin ? ('Login Page'):('SignUp page' )}
            </h1>
            <form className='auth-form' onSubmit={this.submitHandler}>
              < div className='form-control'>
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" ref={this.emailElem} />
              </div>
              < div className='form-control'>
                  <label htmlFor="password">Password</label>
                  <input type="password" id="password" ref={this.passwordElem} />
              </div>
              <div className='form-action'>
                  <button className="btn" type="submit" >Submit</button>
                  <button className="btn" type='button' onClick={this.switchModeHandler}>Switch to {this.state.isLogin ? 'SignUp' : 'Login'}</button>

              </div>
            </form>
            </React.Fragment>
        
        )
    }
}

export default AuthPage;
