export const uploadToIPFS = async (file: File) => {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("https://api.pinata.cloud/files", {
    method: "POST",
    body: formData,
  })
}