const headers = {
  "Authorization": "Bearer "+process.env.MAIN_TOKEN
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const deprecated = searchParams.get('from') || 'false'
  const edgeConfigId = searchParams.get('edgeConfigId') || ''
  const edgeConfigTokenId = searchParams.get('edgeConfigTokenId') || ''
  const excludeReposFilter = searchParams.get('excludeRepos') || ''
  const from = searchParams.get('from') || Date.now() - 1000 * 60 * 60 * 24 * 30 // from 1 month from now
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '10')))+''  
  const repoNameFilter = searchParams.get('repo') || ''
  const repoIdFilter = searchParams.get('repoId') || ''
  const repoUrlFilter = searchParams.get('repoUrl') || ''
  const projectNameFilter = searchParams.get('search') || ''
  const listOfProjects = await fetch(
    `https://api.vercel.com/v9/projects?deprecated=${deprecated}&edgeConfigId=${edgeConfigId}&edgeConfigTokenId=${edgeConfigTokenId}&excludeRepos=${excludeReposFilter}&from=${from}&gitForkProtection=1&limit=${limit}&repo=${repoNameFilter}&repoId=${repoIdFilter}&repoUrl=${repoUrlFilter}&search=${projectNameFilter}`, {
    headers,
    method: 'get'
  })
  const projects = await listOfProjects.json()
  console.log('projects:', projects)
  // const listOfDeployments = await fetch(`https://api.vercel.com/v6/deployments?app=docs&from=${from}&limit=${limit}&projectId=QmXGTs7mvAMMC7WW5ebrM33qKG32QK3h4vmQMjmY&rollbackCandidate=true&since=1540095775941&state=BUILDING,READY&target=production&teamId=SOME_STRING_VALUE&to=1612948664566&until=1540095775951&users=kr1PsOIzqEL5Xg6M4VZcZosf,K4amb7K9dAt5R2vBJWF32bmY`, {
  //   headers,
  //   method: "get"
  // })
  // const deployments = await listOfDeployments.json()
 const data = { hello: 'world', projects }
  return Response.json({ data })
}