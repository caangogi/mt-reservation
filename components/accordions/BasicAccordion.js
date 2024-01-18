import React, {useState} from 'react'
import {FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa"; 

function BasicAccordion() {

    const [selected, setSelected] = useState(null);
    const toggle = (i) =>{
        if(selected === i){
            return setSelected(null)
        }
        setSelected(i)
    };
  return (
    <div className='acordion'>
        <div className='acordion_item' id="title1">
            <div className='acordion_link' onClick={() => toggle("title1")}>
                ¿Qué es el crowdlending inmobiliario? 
                {selected === "title1" ? <FaAngleDoubleUp/> : <FaAngleDoubleDown/>}
            </div>
            <div className={selected === "title1" ? 'show_text_content'  : 'acordion_text_content'}>
                    <p className='acordion_text_title'>El crowdlending inmobiliario es el método de financiación colectiva por el cual, cualquier usuario puede acceder a la participación de un proyecto inmobiliario. Esto quiere decir que el usuario financiará una micro parte de un proyecto completo, relacionado con el sector inmobiliario.</p>
            </div>
        </div>
        <div className='acordion_item' id="title2">
            <div className='acordion_link' onClick={() => toggle("title2")}>
                ¿Qué coste tiene participar en el proyecto?
                {selected === "title2" ? <FaAngleDoubleUp/> : <FaAngleDoubleDown/>} 
            </div>
            <div className={selected === "title2" ? 'show_text_content'  : 'acordion_text_content'}>
                <p className='acordion_text_title'>Solo se aplica una comisión del 10% del total del proyecto si se ejecuta.</p>
            </div>
        </div>
        <div className='acordion_item' id="title3">
            <div className='acordion_link' onClick={() => toggle("title3")}>
                ¿Qué seguridad tiene participar en un proyecto inmobiliario de Crowd4Flipping?
                {selected === "title3" ? <FaAngleDoubleUp/> : <FaAngleDoubleDown/>}  
            </div>
            <div className={selected === "title3" ? 'show_text_content'  : 'acordion_text_content'}>
                <p className='acordion_text_title'>Antes de ofrecer un proyecto de financiación colectiva, se selecciona cuidadosamente por un equipo de expertos su viabilidad técnica, financiera, comercial y jurídica. <br/> <br/> Tu inversión está respaldada por un activo inmobiliario concreto y tangible.  </p>
            </div>
        </div>
        <div className='acordion_item' id="title4">
            <div className='acordion_link' onClick={() => toggle("title4")}>
                ¿Estaré informado del proceso del proyecto? 
                {selected === "title4" ? <FaAngleDoubleUp/> : <FaAngleDoubleDown/>} 
            </div>
            <div className={selected === "title4" ? 'show_text_content'  : 'acordion_text_content'}>
                    <p className='acordion_text_title'>A través del programa de transparencia de Crowd4flipping, se realizará un seguimiento de todo el proyecto hasta su conclusión, informando puntualmente a los participantes de la evolución del mismo.<br/></p>
            </div>
        </div>
        <div className='acordion_item' id="title5">
            <div className='acordion_link' onClick={() => toggle("title5")}>
                ¿Cuál es la cantidad mínima?
                {selected === "title5" ? <FaAngleDoubleUp/> : <FaAngleDoubleDown/>} 
            </div>
            <div className={selected === "title5" ? 'show_text_content'  : 'acordion_text_content'}>
                    <p className='acordion_text_title'>El capital mínimo para participar varía en función de cada proyecto. En la mayoría de los casos se establece un ticket mínimo que variará entre los 500€ y 1000€. <br/></p>

            </div>
        </div>
        <div className='acordion_item' id="title6">
            <div className='acordion_link' onClick={() => toggle("title6")}>
                ¿Cómo se seleccionan los proyectos?
                {selected === "title6" ? <FaAngleDoubleUp/> : <FaAngleDoubleDown/>} 
            </div>
            <div className={selected === "title6" ? 'show_text_content'  : 'acordion_text_content'}>
                    <p className='acordion_text_title'>Con la seguridad que te brinda una compañía con más de 20 años de experiencia en el sector, solo publicamos en nuestra plataforma aquellos proyectos inmobiliarios que ofrecen la mejor relación rentabilidad/riesgo. 
                    <br/>
                    <br/>
                    Nuestro equipo de arquitectos, abogados y economistas son especialistas en valorar la rentabilidad potencial de los proyectos que se proponen en Crowd4flipping.
                    </p>
            </div>
        </div>
        <div className='acordion_item' id="title7">
            <div className='acordion_link' onClick={() => toggle("title7")}>
                ¿Quién puede darse de alta en Crowd4Flipping?
                {selected === "title7" ? <FaAngleDoubleUp/> : <FaAngleDoubleDown/>} 
            </div>
            <div className={selected === "title7" ? 'show_text_content'  : 'acordion_text_content'}>
                <p className='acordion_text_title'>Personas físicas, mayores de edad con nacionalidad española.
                <br/>
                Personas físicas, mayores de edad, en posesión de un número de identificación de extranjero (NIE).
                <br/>
                Cualquier sociedad con CIF español.<br/>
                </p>
            </div>
        </div>
        <div className='acordion_item' id="title8">
            <div className='acordion_link' onClick={() => toggle("title8")}>
                ¿Si tengo alguna duda con quién puedo contactar?
                {selected === "title8" ? <FaAngleDoubleUp/> : <FaAngleDoubleDown/>} 
            </div>
            <div className={selected === "title8" ? 'show_text_content'  : 'acordion_text_content'}>
                    <p className='acordion_text_title'>Si tienes alguna duda puedes contactar con nosotros a contacto@crowd4flipping.com o en el +34 672 126 268.<br/><br/>
                    Estaremos encantados de poder ayudarte.<br/>
                </p>
            </div>
        </div>
        <div className='acordion_item' id="title9">
            <div className='acordion_link' onClick={() => toggle("title9")}>
                ¿Qué ocurre si hago una transferencia y la financiación colectiva ya ha sido completada?
                {selected === "title9" ? <FaAngleDoubleUp/> : <FaAngleDoubleDown/>} 
            </div>
            <div className={selected === "title9" ? 'show_text_content'  : 'acordion_text_content'}>
                    <p className='acordion_text_title'>Debido a la alta demanda de inversión en los proyectos de Crowd4Flipping, es posible que en el periodo de tiempo de realizar la transferencia hasta que se recibe, el proyecto ya se haya completado. En este caso no te preocupes, reembolsaremos el dinero en la misma cuenta en un periodo de 24h y serás incluido en la lista prioritaria del próximo proyecto. <br/>
                </p>
            </div>
        </div>
    </div> 
  )
}

export default BasicAccordion
