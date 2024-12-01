export async function handleNonOkResponse(response: Response) {
  const error = new Error()
  error.name = response.statusText
  try {
    error.message = (await response.json()).message
  } catch {
    error.message = await response.text()
  }
  return error
}
export async function getPublicPosts() {
  const response = await fetch(`${process.env.API_GATEWAY_URL}/public-posts`)

  if (response.ok) return response.json()
  throw await handleNonOkResponse(response)
}

export async function getPosts(token: string) {
  const response = await fetch(`${process.env.API_GATEWAY_URL}/posts`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  })

  if (response.ok) return response.json()
  throw await handleNonOkResponse(response)
}
export async function getPost(token: string, id: string) {
  const response = await fetch(`${process.env.API_GATEWAY_URL}/posts/${id}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  })

  if (response.ok) return response.json()
  throw await handleNonOkResponse(response)
}

export async function getFriends(token: string) {
  const response = await fetch(`${process.env.API_GATEWAY_URL}/friendships`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  })

  if (response.ok) return response.json()
  throw await handleNonOkResponse(response)
}

export async function getPublicProfile(token: string, userId: string) {
  const response = await fetch(
    `${process.env.API_GATEWAY_URL}/public-profiles/${userId}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  )

  if (response.ok) return response.json()
  throw await handleNonOkResponse(response)
}
export async function getCurrentProfile(token: string) {
  const response = await fetch(`${process.env.API_GATEWAY_URL}/profiles`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  })

  if (response.ok) return response.json()
  throw await handleNonOkResponse(response)
}
