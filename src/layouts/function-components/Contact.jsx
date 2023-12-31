import { Amplify } from "aws-amplify";
import configAmplify from '../../aws-exports'
Amplify.configure(configAmplify)
import { generateClient } from 'aws-amplify/api'
import { createLead } from '../../graphql/mutations'
import { useState, useCallback } from "react";

import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const client = generateClient()

const ContactForm = ({ data }) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    interes: '',
    mensaje: ''
  })

  const handleSubmit = (async (token) => {



    const { name, email, interes, mensaje } = formState
    if (name && email) {
      try {

        await client.graphql({
          query: createLead,
          variables: {
            input: {
              name, email, interes, mensaje, recaptchaToken:token
            }
          }
        })
       window.location.href = "/contact-thanks";
       
      } catch (e) {

        alert(e)
      }
    } else {
     // console.log({ name, email })
      alert("Favor de llenar todos los campos")
    }
  })

  const handleContactFormSubmit = (async (e) => {
    e.preventDefault()
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available');
      return;
    }

    const token = await executeRecaptcha('contact');
    //console.log({ token })
    handleSubmit(token)
  })


  return (
    <>

      <form
        className="lg:max-w-[484px]"
        method="POST"
        onSubmit={handleContactFormSubmit}
      >
        <div className="form-group mb-5">
          <label className="form-label" htmlFor="name">Nombre</label>
          <input
            className="form-control"
            type="text"
            id="name"
            placeholder="Tu nombre"
            value={formState.name}
            onChange={(e) =>
              setFormState({ ...formState, name: e.target.value })
            }
          />
        </div>
        <div className="form-group mb-5">
          <label className="form-label" htmlFor="email">Email</label>
          <input
            className="form-control"
            type="email"
            id="email"
            placeholder="Tu correo electrónico"
            value={formState.email}
            onChange={(e) =>
              setFormState({ ...formState, email: e.target.value })
            }
          />
        </div>
        <div className="form-group mb-5">
          <label className="form-label" htmlFor="reason">Interés</label>
          <select name="interes" id="interes" className="form-select"  onChange={(e) =>
              setFormState({ ...formState, interes: e.target.value })
            } >
            <option value="">Selecciona</option>
            <option value="Comercial">Comercial</option>
            <option value="Bolsa de trabajo">Bolsa de trabajo</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div className="form-group mb-5">
          <label className="form-label" htmlFor="mensaje">Mensaje</label>
          <textarea
            className="form-control h-[150px]"
            id="mensaje"
            cols="30"
            rows="10"
            onChange={(e) =>
              setFormState({ ...formState, mensaje: e.target.value })
            }
            ></textarea>
        </div>

        <button
          className="btn btn-primary block w-full"
          type="submit"
        >Solicitar Información</button>

      </form>

    </>
  );
};

const Contact = () => (
  <GoogleReCaptchaProvider reCaptchaKey="6LeraT8pAAAAAEWxiV6mEY6FHRE6n5tqOIo61hrw">
    <ContactForm />
  </GoogleReCaptchaProvider>
)

export default Contact;
