import { useState, useEffect, useRef } from "react";
import axios from "../libs/axios.libs";

let videoChunks = [];

const useVideoRecorder = () => {
	const [isRecording, setIsRecording] = useState(false);
	const videoRef = useRef();
	const mediaRecorderRef = useRef();

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true,
			});
			videoRef.current.srcObject = stream;
			mediaRecorderRef.current = new MediaRecorder(stream);

			mediaRecorderRef.current.onstart = () => {
				setIsRecording(true);
				console.log("video recording started...");
			};

			mediaRecorderRef.current.ondataavailable = async (event) => {
				if (event.data.size > 0) {
					videoChunks.push(event.data);
				}
			};

			mediaRecorderRef.current.onstop = async () => {
				console.log("video recording stopped");
				setIsRecording(false);
				const blobObj = new Blob(videoChunks, { type: "video/webm" });
				const videoUrl = URL.createObjectURL(blobObj);

				//send this form data to server
				const formData = new FormData();
				formData.append("video", blobObj, "recorded_video.mp4");

				try {
					const response = await axios.post(
						"/user/user-responses/video",
						formData
					);

					console.log("Server Response:", response.data);
				} catch (error) {
					console.error("Error sending audio to the server:", error);
				}

				//download the video file
				// const a = document.createElement("a");
				// document.body.appendChild(a);
				// a.style = "display: none";
				// a.href = videoUrl;
				// a.download = "recorded_audio.mp4";
				// a.click();
				// window.URL.revokeObjectURL(videoUrl);
				videoChunks = [];
			};

			mediaRecorderRef.current.start();
		} catch (error) {
			console.error("Error accessing media devices:", error);
		}
	};

	const stopRecording = () => {
		mediaRecorderRef.current?.stop();
	};

	useEffect(() => {
		return () => {
			mediaRecorderRef.current?.stop();
		};
	}, []);

	return {
		isRecording,
		startRecording,
		stopRecording,
		videoRef,
	};
};

export default useVideoRecorder;
