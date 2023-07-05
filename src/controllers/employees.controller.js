import { pool } from "../db.js";
import { google } from 'googleapis';
import fs from 'fs';

import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    organization: "org-RC4oh3WHEh7cSAS9AAYe6V1g",
    apiKey: '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',
});
const openai = new OpenAIApi(configuration);


const youtube = google.youtube({
    version: 'v3',
    auth:'AIzaSyAtYbKE0oTNvUdW_Ujgl2IVmU9h61s-Ry4'
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
       
        const valuesTrial = [
            ['a','a2','-'],
            ['b','b2','-']
        ]
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
            videoId:'ZjTIEO_Qe7w',
			maxResults: 100
		}, (err, res) => {
			if(err) reject(err);
            //console.log(res.data.items);
			resolve(res.data.items);
		});
	});
}

//Get YouTube Comments//

export const get_UtubeComments = async (req, res) => { 
  try {

    let comments = await getYoutubeComments();
    for(let i = 0; i < 5; i++){ // comments.length

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Tell me if the comment is something related to a positive view on economic forecast or is it informative or is it negative comment also give me a short description of the comment: + ${comments[i].snippet.topLevelComment.snippet.textOriginal}\n` ,
        max_tokens: 7,
        temperature: 0,
        });
      
      console.log(response.data.choices[0].text);

    }

  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
}