import {useContext, useEffect, useState} from "react";
import useFetch from "../../../hooks/useFetch";
import Loader from "../../../uikit/Loader";
import {Routes, Route, Link} from "react-router-dom";
import {ProjectContext} from "../ProjectContext";
import Sprint from "./Sprint";
import CreateSprint from "./CreateSprint";
import {AccessGuard} from "cerberus-reactjs";

export default function Sprints() {

    return <>
        <Routes>
            <Route path=":id/*" element={<Sprint/>}/>
            <Route exact path="/" element={<SprintList/>}/>
        </Routes>
    </>
}

function SprintList() {
    const [sprints, setSprints] = useState([])
    const projectCtx = useContext(ProjectContext)
    const {get, loading} = useFetch("/api/")
    const [showCreate, setShowCreate] = useState(false)

    useEffect(() => {
        get("projects/"+projectCtx.project.id+"/sprints")
            .then(d => {
                if (d) {
                    setSprints(d)
                }
            })
            .catch(e => console.error(e))
    }, [])

    function handleNewClicked(e) {
        e.preventDefault()
        setShowCreate(p => !p)
    }

    if (loading) {
        return <Loader/>
    }

    return <>

        <ul>
            {
                sprints.map(sprint => {
                    return (
                        <li className="nav-item" key={sprint.id}>
                            <AccessGuard
                                resourceId={sprint.id}
                                action="ReadSprint"
                                otherwise={<span>{sprint.sprintNumber}: {sprint.goal}</span>}>
                                <Link to={`${sprint.id}`}>
                                    <i>{sprint.sprintNumber}: {sprint.goal}</i>
                                    <i className="m-1">&#8594;</i>
                                </Link>
                            </AccessGuard>
                        </li>
                    )
                })
            }
        </ul>

        <AccessGuard resourceId={projectCtx.project.id} action="CreateSprint">
            {
                !showCreate && <Link to="" onClick={handleNewClicked}>New Sprint</Link>
            }
            {
                showCreate && <CreateSprint
                    sprints={sprints}
                    setSprints={setSprints}
                    setShowCreate={setShowCreate}/>
            }
        </AccessGuard>
    </>
}