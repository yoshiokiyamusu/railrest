import { pool } from "../db.js";
import { google } from 'googleapis';
import fs from 'fs';

import { Open_ai_organization, Open_ai_api_key, Youtube_key } from "../config.js";



import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    organization: Open_ai_organization,
    apiKey: Open_ai_api_key, 
});
const openai = new OpenAIApi(configuration);


const youtube = google.youtube({
    version: 'v3',
    auth:Youtube_key
});

//Functions!!//


export const getEmployees = async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM t_employee");
      res.json(rows);
    } catch (error) {
      return res.status(500).json({ message: "Something goes wrong" });
    }
  };

//Create a new employee
export const createEmployee = async (req, res) => {
    try {
        const { name, salary } = req.body;
        const [rows] = await pool.query(
          "INSERT INTO t_employee (name, salary) VALUES (?, ?)",
          [name, salary]
        );
        res.status(201).json({ id: rows.insertId, name, salary });
      } catch (error) {
        return res.status(500).json({ message: "Something goes wrong" });
      }
}

export const deleteEmployee = async (req, res) => {
  try {
    
    const { id } = req.params;
    const [rows] = await pool.query("DELETE FROM t_employee WHERE id = ?", [id]);

    if (rows.affectedRows <= 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};



export const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM t_employee WHERE id = ?", [id,]);

    if (rows.length <= 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
}


export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, salary } = req.body;

    const [result] = await pool.query(
      "UPDATE t_employee SET name = IFNULL(?, name), salary = IFNULL(?, salary) WHERE id = ?",
      [name, salary, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Employee not found" });

    const [rows] = await pool.query("SELECT * FROM t_employee WHERE id = ?", [
      id,
    ]);

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

//Tomar comentarios de youtube y hacer insert en MySQL
export const load_UtubeComments = async (req, res) => { 
    try {
        const utcomArray = [];
        let comments = await getYoutubeComments();
        for(let i = 0; i < comments.length; i++){
                       
            const unis_array = ([
              comments[i].id + ' ' + i,
              comments[i].snippet.topLevelComment.snippet.textOriginal,
              '-'                       
            ]);
            utcomArray.push(unis_array);
        }
        //console.log(utcomArray);
       /*
        const valuesTrial = [
            ['a','a2','-'],
            ['b','b2','-']
        ]
        */
       const [rows] = await pool.query("INSERT INTO nx_utubecom (iden, comentario_det,criteria1 ) VALUES  ?",[utcomArray]);
       console.log(rows);

       res.json({rows})
     
    } catch (error) {
        return res.status(500).json({ message: "Something goes wrong" });
    }

};

async function getYoutubeComments(){
	return new Promise((resolve, reject) => {
		youtube.commentThreads.list({
            part:'snippet',
            videoId:'WL5XBs_ha3g',
			maxResults: 100
		}, (err, res) => {
			if(err) reject(err);
            //console.log(res.data.items);
			resolve(res.data.items);
		});
	});
}

//Get YouTube Comments//
//Trial Only
/*
export const get_UtubeComments = async (req, res) => { 
  try {
    
    let comments = await getYoutubeComments();   console.log(comments.length);
    
    for(let i = 0; i < 10; i++){ // comments.length
      console.log(i);
      console.log(comments[i].snippet.topLevelComment.snippet.textOriginal);
     
      const response = await openai.createCompletion({
        model: "text-davinci-003",   
        prompt: `Please tell me if the following comment is a question: + ${comments[i].snippet.topLevelComment.snippet.textOriginal}\n` ,   
        max_tokens: 7,
        temperature: 0,
        });
      
      console.log(response.data.choices[i]); 
      console.log(response.data.choices[0].text);
      
    }

  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
}
*/






//Tomar los comentarios una vez ya en Mysql
export const getCommentVal = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, comentario_det FROM nx_utubecom");
    return rows; //para que sea consumido por otra funcion
    //res.json(rows); //para renderizar la respuesta
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const clasify_UtubeComments = async (req, res) => { 
  try {
    const comments = await getCommentVal();  
    console.log(comments.length);

    for(let i = 0; i < comments.length; i++){ // comments.length
      //console.log(comments[i].comentario_det);
     
      const response = await openai.createCompletion({
        model: "text-davinci-003",    
        prompt: `Please tell me if the following comment is a question: + ${comments[i].comentario_det}\n` ,   
        max_tokens: 7,
        temperature: 0,
      });
      
      //console.log(comments[i].comentario_det + ' * ChatGPT: ' + response.data.choices[0].text);

      const [result] = await pool.query(
        "UPDATE nx_utubecom SET criteria1 = IFNULL(?, criteria1) WHERE id = ?",
        [response.data.choices[0].text, comments[i].id]
      );
      
    }//End for-loop
    return  res.status(200).json({ message: "Data Operation Done"})
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
}