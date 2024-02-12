import React from "react";
import { Link } from "react-router-dom";
import Edit from "../images/edit.png";
import Delete from "../images/delete.png";
import Menu from "../components/Menu";

const Single=()=>{
    return(
        <div className="single">
            <div className="content">
                <img src="https://images.pexels.com/photos/7008010/pexels-photo-7008010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt=""/>
                <div className="user">
                    <img src="https://images.pexels.com/photos/7008010/pexels-photo-7008010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt=""/>
                    <div className="info">
                        <span>John Doe</span>
                        <p>2 hours ago</p>
                    </div>
                    <div className="edit">
                        <Link to ={`/write?edit=2`}>
                            <img src={Edit} alt=""/>
                        </Link>
                        <img src={Delete} alt=""/>
                    </div>
                </div>
                <h1>Lorem ipsum dolor sit</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odit error, voluptatem quidem, quae quisquam placeat omnis porro officia tempora facere fugiat delectus itaque! Ab dolores doloribus, eaque debitis omnis mollitia!
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odit error, voluptatem quidem, quae quisquam placeat omnis porro officia tempora facere fugiat delectus itaque! Ab dolores doloribus, eaque debitis omnis mollitia!
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odit error, voluptatem quidem, quae quisquam placeat omnis porro officia tempora facere fugiat delectus itaque! Ab dolores doloribus, eaque debitis omnis mollitia!
                </p>
            </div>
            <Menu/>
        </div>
    )
}
export default Single; 