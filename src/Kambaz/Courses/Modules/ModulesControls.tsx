import { FaPlus } from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";
import { Button, Dropdown } from "react-bootstrap";
import Unpublish from "./Unpublish";
import ModuleEditor from "./ModuleEditor";
import { useSelector } from "react-redux";
export default function ModulesControls({ moduleName, setModuleName, addModule }:
    { moduleName: string; setModuleName: (title: string) => void; addModule: () => void; }) {
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    return (
        <div id="wd-modules-controls" className="text-nowrap">
            {currentUser.role === "FACULTY" &&
                <span>
                    <Button variant="danger" size="lg" className="me-1 float-end" id="wd-add-module-btn"
                        data-bs-toggle="modal" data-bs-target="#wd-add-module-dialog">
                        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
                        Module
                    </Button>
                    <ModuleEditor dialogTitle="Add Module" moduleName={moduleName}
                        setModuleName={setModuleName} addModule={addModule} />
                    <Dropdown className="float-end me-2">
                        <Dropdown.Toggle variant="secondary" size="lg" id="wd-publish-all-btn">
                            <GreenCheckmark /> Publish All
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item id="wd-publish-all">
                                <GreenCheckmark /> Publish All
                            </Dropdown.Item>
                            <Dropdown.Item id="wd-publish-all-modules-and-items">
                                <GreenCheckmark /> Publish all modules and items
                            </Dropdown.Item>
                            <Dropdown.Item id="wd-publish-modules-only">
                                <GreenCheckmark /> Publish modules only
                            </Dropdown.Item>
                            <Dropdown.Item id="wd-unpublish-all-modules-and-items">
                                <Unpublish /> Unpublish all modules and items
                            </Dropdown.Item>
                            <Dropdown.Item id="wd-unpublish-modules-only">
                                <Unpublish /> Unpublish modules only
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button size="lg" variant="secondary" className="me-1 float-end" id="wd-view-progress">
                        View Progress
                    </Button>
                    <Button size="lg" variant="secondary" className="me-1 float-end" id="wd-collapse-all">
                        Collapse All
                    </Button>
                </span>
            }
        </div >
    );
}
