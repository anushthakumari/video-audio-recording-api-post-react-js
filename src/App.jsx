import useAudioRecorder from "./hooks/useAudioRecorder";
import useVideoRecorder from "./hooks/useVideoRecorder";

function App() {
	const audioState = useAudioRecorder();
	const videoState = useVideoRecorder();

	return (
		<>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}>
				<div style={{ minWidth: "400px" }}>
					{audioState.isRecording ? <h3>Audio is being recorded</h3> : null}
					<div style={{ marginBottom: "20px" }}>
						<button
							onClick={audioState.startRecording}
							style={{
								marginRight: "18px",
							}}>
							Start Audio Recording
						</button>
						<button onClick={audioState.stopRecording}>
							Stop Audio Recording
						</button>
					</div>
					<video
						ref={videoState.videoRef}
						style={{ width: "100%", height: "100%" }}
						autoPlay
						playsInline
						muted
					/>
					{videoState.isRecording ? <h3>Video is being recorded</h3> : null}
					<div style={{ marginBottom: "20px" }}>
						<button
							onClick={videoState.startRecording}
							style={{
								marginRight: "18px",
							}}>
							Start Video Recording
						</button>
						<button onClick={videoState.stopRecording}>
							Stop Video Recording
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
