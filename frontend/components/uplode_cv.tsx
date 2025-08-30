
import React, { useState } from 'react';

const UplodeCV = () => {
	const [file, setFile] = useState<File | null>(null);
	const [status, setStatus] = useState('');

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!file) return;
		setStatus('Uploading...');
		const formData = new FormData();
		formData.append('cv', file);
		try {
			const res = await fetch('http://localhost:5000/api/cv/upload', {
				method: 'POST',
				body: formData,
				credentials: 'include', // Include cookies for authentication
			});
			const data = await res.json();
			if (res.ok) {
				setStatus(`Success! CV processed with ${data.chunksCreated} chunks`);
			} else {
				setStatus(data.message || 'Upload failed');
			}
		} catch (err) {
			setStatus('Upload failed - Server error');
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
			<button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Upload CV</button>
			{status && <div>{status}</div>}
		</form>
	);
};

export default UplodeCV;
