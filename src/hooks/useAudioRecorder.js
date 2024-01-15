import { useState, useEffect } from "react";

import axios from "../libs/axios.libs";

let audioRecorder;
let audioChunks = [];

const useAudioRecorder = () => {
	const [isRecording, setIsRecording] = useState(false);

	const startRecording = () => {
		navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then((stream) => {
				// Initialize the media recorder object
				audioRecorder = new MediaRecorder(stream);

				audioRecorder.onstart = () => {
					// setAudioChunks([]);
					audioChunks = [];
					setIsRecording(true);
				};

				audioRecorder.onstop = async () => {
					setIsRecording(false);

					const blobObj = new Blob(audioChunks, { type: "audio/webm" });
					const audioUrl = URL.createObjectURL(blobObj);

					const formData = new FormData();
					formData.append("audio", blobObj, "recorded_audio.mp3");

					try {
						const response = await axios.post(
							"/user/user-responses/audio",
							formData
						);

						console.log("Server Response:", response.data);
					} catch (error) {
						console.error("Error sending audio to the server:", error);
					}

					// const a = document.createElement("a");
					// document.body.appendChild(a);
					// a.style = "display: none";
					// a.href = audioUrl;
					// a.download = "recorded_audio.mp3";
					// a.click();
					// window.URL.revokeObjectURL(audioUrl);
					audioChunks = [];
				};

				// dataavailable event is fired when the recording is stopped
				audioRecorder.addEventListener("dataavailable", (e) => {
					console.log(e.data);
					audioChunks.push(e.data);
				});

				audioRecorder.start();
			})
			.catch((err) => {
				console.log("Error: " + err);
			});
	};

	const stopRecording = () => {
		audioRecorder.stop();
	};

	useEffect(() => {
		return () => {
			audioRecorder?.stop();
		};
	}, []);

	return {
		isRecording,
		startRecording,
		stopRecording,
	};
};

export default useAudioRecorder;
