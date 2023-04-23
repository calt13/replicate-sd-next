export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  const validAccessCode = process.env.ACCESS_CODE;

  // if (!authHeader || authHeader !== `Bearer ${validAccessCode}`) {
  //   res.statusCode = 401;
  //   res.end(JSON.stringify({ message: "Unauthorized" }));
  //   return;
  // }

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Pinned to a specific version of Stable Diffusion
      // See https://replicate.com/stability-ai/stable-diffussion/versions
      version:
        "328bd9692d29d6781034e3acab8cf3fcb122161e6f5afb896a4ca9fd57090577",
      // 1.5  328bd9692d29d6781034e3acab8cf3fcb122161e6f5afb896a4ca9fd57090577
      // 2.1 https://replicate.com/stability-ai/stable-diffusion/versions/db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf
      // This is the text prompt that will be submitted by a form on the frontend
      input: req.body,
    }),
  });

  if (response.status !== 201) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const prediction = await response.json();
  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}
