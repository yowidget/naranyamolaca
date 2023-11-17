import { Amplify } from "aws-amplify";
import configAmplify from '../../aws-exports'
Amplify.configure(configAmplify)
import { generateClient } from 'aws-amplify/api'
import { createLead } from '../../graphql/mutations'
import { useState } from "react";

const client = generateClient()

const Contact = ({ data }) => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
  })

  const handleContactFormSubmit = async (e) => {
    e.preventDefault()
    const { name, email } = formState
    if (name && email) {
      try {
        
        await client.graphql({
          query: createLead,
          variables:{
            input:{
              name, email
            }
          }
        })
       alert("Enviado")
      } catch (e) {
        
        alert(e)
      }
    } else {
     alert("c")
    }
  }

  return (
    <>
    
      <form
        className="lg:max-w-[484px]"
        method="POST"
        onSubmit={handleContactFormSubmit}
      >
        <div className="form-group mb-5">
          <label className="form-label" htmlFor="name">Full Name</label>
          <input
            className="form-control"
            type="text"
            id="name"
            placeholder="Your Full Name"
            value={formState.name}
            onChange={(e) =>
              setFormState({ ...formState, name: e.target.value })
            }
          />
        </div>
        <div className="form-group mb-5">
          <label className="form-label" htmlFor="eamil">Email Adrdess</label>
          <input
            className="form-control"
            type="email"
            id="email"
            placeholder="Your  Email Address"
            value={formState.email}
            onChange={(e) =>
              setFormState({ ...formState, email: e.target.value })
            }
          />
        </div>
        <div className="form-group mb-5">
          <label className="form-label" htmlFor="reason">Reason/Purpose</label>
          <select name="reason" id="reason" className="form-select" >
            <option value="">Select reason/purpose</option>
            <option value="investment plane">Investment Plan</option>
            <option value="investment plane-2">Investment Plan 2</option>
            <option value="investment plane-3">Investment Plan 3</option>
          </select>
        </div>
        <div className="form-group mb-5">
          <label className="form-label" htmlFor="message">Message Here</label>
          <textarea
            className="form-control h-[150px]"
            id="message"
            cols="30"
            rows="10"></textarea>
        </div>

        <button
          className="btn btn-primary block w-full"
          type="submit"
        >Solicitar Información</button>
        
      </form>

    </>
  );
};

export default Contact;
