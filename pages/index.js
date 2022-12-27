import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const useStyles = makeStyles({
    root: {
      maxWidth: 600,
      margin: "0 auto",
      padding: 20,
    },
    heading: {
      textAlign: "center",
      marginBottom: 20,
    },
    chatLog: {
      height: 300,
      overflowY: "scroll",
    },
  });

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const classes = useStyles();

  async function onSubmit(event) {
    event.preventDefault();

    // Store the input message in the messages array
    const newMessage = {
      text: input,
    };
    setMessages([...messages, newMessage]);

    // Send the input message to the API
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Use the input message and the existing messages as context for GPT
        input: input,
        context: messages.map((m) => m.text).join("\n"),
      }),
    });
    const data = await response.json();

    // Store the response from the API in the messages array
    const newResponse = {
      text: data.result,
    };
    setMessages([...messages, newResponse]);

    setInput("");
  }

  return (
    <div className={classes.root}>
      <div>
        <title>OpenAI Quickstart</title>
      </div>

      <Card className={classes.root}>
        <CardContent>
          <Typography variant="h5" className={classes.heading}>
            Ask a question
          </Typography>
          <form onSubmit={onSubmit}>
            <TextField
              type="text"
              name="input"
              placeholder="Enter a question"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              fullWidth
              variant="outlined"
            />
            <Button type="submit" variant="contained" color="primary">
              Ask
            </Button>
          </form>
          <div className={classes.chatLog}>
            {messages.map((message, index) => (
              <div key={index}>
                <Typography variant="subtitle1" color="textSecondary">
                  {message.text}
                </Typography>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
