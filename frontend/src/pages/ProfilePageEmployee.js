import React, {useState} from "react";
import "../styles/ProfilePageEmployee.css"
export default (props) => {
    const [input1, onChangeInput1] = useState('');
    return (
        <div className="contain">
            <div className="scroll-view">
                <div className="row-view">
                    <div className="column">
						<span className="text" >
							{"HRCLOUDX"}
						</span>
                        <div className="column2">
                            <div className="box">
                            </div>
                            <div className="box2">
                            </div>
                        </div>
                        <div className="column3">
                            <div className="row-view2">
                                <img
                                    src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e5cdd104-7027-4111-b9b0-203ead13153a"}
                                    className="image"
                                />
                                <span className="text2" >
									{"Dashboard"}
								</span>
                            </div>
                            <div className="row-view3">
                                <img
                                    src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/f83d5003-9309-4c08-b4fb-effc29fd197d"}
                                    className="image2"
                                />
                                <span className="text3" >
									{"Profile"}
								</span>
                                <div className="box3">
                                </div>
                            </div>
                            <div className="row-view4">
                                <img
                                    src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/6980a5d3-86da-498c-89ac-e7776a1a050a"}
                                    className="image3"
                                />
                                <span className="text4" >
									{"Leave Requests"}
								</span>
                            </div>
                        </div>
                        <div className="column4">
                            <img
                                src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/351f8885-31c6-4919-8816-1e9afdfbaee3"}
                                className="image4"
                            />
                            <div className="column5">
                                <div className="column6">
                                    <img
                                        src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/2132e7a3-85e8-43b4-a441-49f76f6dc5d1"}
                                        className="image5"
                                    />
                                    <span className="absolute-text" >
										{"Upgrade to PRO"}
									</span>
                                </div>
                                <span className="text5" >
									{"to get access to all features!"}
								</span>
                            </div>
                        </div>
                    </div>
                    <div className="column7">
                        <div className="row-view5">
                            <div className="column8">
								<span className="text6" >
									{"Pages / Profile"}
								</span>
                                <span className="text7" >
									{"Profile"}
								</span>
                            </div>
                            <div className="row-view6">
                                <div className="row-view7">
                                    <img
                                        src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/fb74aa3d-1201-4827-aba3-e8456f9e7557"}
                                        className="image6"
                                    />
                                    <input
                                        placeholder={"Search"}
                                        value={input1}
                                        onChange={(event)=>onChangeInput1(event.target.value)}
                                        className="input"
                                    />
                                </div>
                                <img
                                    src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/5d37501d-2f6f-43eb-8027-f0dcb7225cec"}
                                    className="image7"
                                />
                                <img
                                    src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/fc94b941-d6a8-49dd-9e4a-a8d7bce035cd"}
                                    className="image8"
                                />
                                <img
                                    src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/5f95be88-67e2-436a-bad1-d0a2554ba6e0"}
                                    className="image7"
                                />
                                <img
                                    src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/4dfb0d26-a823-4773-9ff9-02c8455e9f5b"}
                                    className="image4"
                                />
                            </div>
                        </div>
                        <div className="column9">
                            <div className="row-view8">
                                <div className="column10">
                                    <div className="column11">
                                        <img
                                            src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/57709ee9-ee37-41a1-8342-a56a90377035"}
                                            className="image9"
                                        />
                                        <img
                                            src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/27b5ab18-748c-4fa7-b21c-07e1da88edcf"}
                                            className="absolute-image"
                                        />
                                    </div>
                                    <div className="view">
                                        <div className="column12">
											<span className="text8" >
												{"Jane Doe"}
											</span>
                                            <span className="text9" >
												{"Product Designer"}
											</span>
                                        </div>
                                    </div>
                                    <div className="row-view9">
                                        <div className="column13">
											<span className="text10" >
												{"17"}
											</span>
                                            <span className="text11" >
												{"Posts"}
											</span>
                                        </div>
                                        <div className="column14">
											<span className="text10" >
												{"9.7k"}
											</span>
                                            <span className="text11" >
												{"Followers"}
											</span>
                                        </div>
                                        <div className="column12">
											<span className="text10" >
												{"274"}
											</span>
                                            <span className="text11" >
												{"Followers"}
											</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="column15">
                                    <div className="row-view10">
                                        <img
                                            src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/35bb522e-7190-4669-9e39-f9992ef28f4d"}
                                            className="image10"
                                        />
                                        <button className="button"
                                                onClick={()=>alert("Pressed!")}>
                                            <img
                                                src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/6ddec5e0-c842-41ce-9839-ef84315aca47"}
                                                className="image11"
                                            />
                                        </button>
                                    </div>
                                    <div className="column16">
										<span className="text12" >
											{"Your storage"}
										</span>
                                        <span className="text13" >
											{"Supervise your drive space in the easiest way"}
										</span>
                                    </div>
                                    <div className="column17">
                                        <div className="row-view11">
											<span className="text14" >
												{"25.6 Gb"}
											</span>
                                            <span className="text15" >
												{"50 Gb"}
											</span>
                                        </div>
                                        <div className="view2">
                                            <div className="box4">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row-view12">
                                    <div className="column18">
                                        <img
                                            src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/f81c15c3-242e-4ba1-91ed-f191592c92b7"}
                                            className="image12"
                                        />
                                        <span className="text16" >
											{"Upload Files"}
										</span>
                                        <span className="text17" >
											{"PNG, JPG and GIF files are allowed"}
										</span>
                                    </div>
                                    <div className="column19">
										<span className="text18" >
											{"Complete your profile"}
										</span>
                                        <span className="text19" >
											{"Stay on the pulse of distributed projects with an anline whiteboard to plan, coordinate and discuss"}
										</span>
                                        <div className="view3">
											<span className="text20" >
												{"Publish now"}
											</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row-view13">
                                <div className="column20">
									<span className="text21" >
										{"All Projects"}
									</span>
                                    <span className="text22" >
										{"Here you can find more details about your projects. Keep you user engaged by providing meaningful information."}
									</span>
                                    <div className="column21">
                                        <div className="row-view14">
                                            <img
                                                src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/9c80177c-314a-4f0a-8b59-2f7172cc43f6"}
                                                className="image13"
                                            />
                                            <div className="column22">
												<span className="text23" >
													{"Technology behind the Blockchain"}
												</span>
                                                <div className="row-view">
													<span className="text24" >
														{"Project #1"}
													</span>
                                                    <span className="text25" >
														{"•"}
													</span>
                                                    <span className="text26" >
														{"See project details"}
													</span>
                                                </div>
                                            </div>
                                            <img
                                                src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/b35fea9b-a952-4264-af4d-0402a2c28137"}
                                                className="image14"
                                            />
                                        </div>
                                        <div className="row-view14">
                                            <img
                                                src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e72c4cfd-fba8-4609-b6b2-3bb212d5b895"}
                                                className="image13"
                                            />
                                            <div className="column23">
												<span className="text23" >
													{"Greatest way to a good Economy"}
												</span>
                                                <div className="row-view">
													<span className="text24" >
														{"Project #2"}
													</span>
                                                    <span className="text25" >
														{"•"}
													</span>
                                                    <span className="text26" >
														{"See project details"}
													</span>
                                                </div>
                                            </div>
                                            <img
                                                src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/7691a40f-5bb1-4649-ac52-b4c3fd40e625"}
                                                className="image14"
                                            />
                                        </div>
                                        <div className="row-view15">
                                            <img
                                                src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/cc91f55f-a364-4d2b-b9ab-a674cd9f7238"}
                                                className="image13"
                                            />
                                            <div className="column24">
												<span className="text23" >
													{"Most essential tips for Burnout"}
												</span>
                                                <div className="row-view">
													<span className="text25" >
														{"Project #3"}
													</span>
                                                    <span className="text25" >
														{"•"}
													</span>
                                                    <span className="text26" >
														{"See project details"}
													</span>
                                                </div>
                                            </div>
                                            <img
                                                src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/b95b63a7-a150-43a1-b94a-67095e2d7146"}
                                                className="image14"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="column25">
									<span className="text21" >
										{"General Information"}
									</span>
                                    <span className="text27" >
										{"As we live, our hearts turn colder. Cause pain is what we go through as we become older. We get insulted by others, lose trust for those others. We get back stabbed by friends. It becomes harder for us to give others a hand. We get our heart broken by people we love, even that we give them all..."}
									</span>
                                    <div className="column21">
                                        <div className="row-view16">
                                            <button className="button-column"
                                                    onClick={()=>alert("Pressed!")}>
												<span className="text28" >
													{"Education"}
												</span>
                                                <span className="text29" >
													{"Stanford University"}
												</span>
                                            </button>
                                            <button className="button-column2"
                                                    onClick={()=>alert("Pressed!")}>
												<span className="text28" >
													{"Languages"}
												</span>
                                                <span className="text29" >
													{"English, Spanish, Italian"}
												</span>
                                            </button>
                                        </div>
                                        <div className="row-view16">
                                            <button className="button-column"
                                                    onClick={()=>alert("Pressed!")}>
												<span className="text28" >
													{"Department"}
												</span>
                                                <span className="text29" >
													{"Product Design"}
												</span>
                                            </button>
                                            <button className="button-column2"
                                                    onClick={()=>alert("Pressed!")}>
												<span className="text28" >
													{"Work History"}
												</span>
                                                <span className="text29" >
													{"Google, Facebook"}
												</span>
                                            </button>
                                        </div>
                                        <div className="row-view">
                                            <button className="button-column"
                                                    onClick={()=>alert("Pressed!")}>
												<span className="text28" >
													{"Organization"}
												</span>
                                                <span className="text29" >
													{"Simmmple Web LLC"}
												</span>
                                            </button>
                                            <button className="button-column2"
                                                    onClick={()=>alert("Pressed!")}>
												<span className="text28" >
													{"Birthday"}
												</span>
                                                <span className="text29" >
													{"20 July 1986"}
												</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="column26">
                                    <div className="row-view17">
										<span className="text30" >
											{"Notifications"}
										</span>
                                        <div className="box5">
                                        </div>
                                        <button className="button"
                                                onClick={()=>alert("Pressed!")}>
                                            <img
                                                src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/03310866-1a7e-4c11-baa8-8a37f4f6c582"}
                                                className="image11"
                                            />
                                        </button>
                                    </div>
                                    <div className="column27">
                                        <div className="row-view18">
                                            <img
                                                src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/0c106869-82ae-4fc4-a28d-6ed7aee438db"}
                                                className="image15"
                                            />
                                            <span className="text31" >
												{"Item update notifications"}
											</span>
                                        </div>
                                        <div className="row-view18">
                                            <img
                                                src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/d6414e25-9c98-4796-838f-e02a9dd576fc"}
                                                className="image15"
                                            />
                                            <span className="text32" >
												{"Item comment notifications"}
											</span>
                                        </div>
                                        <div className="row-view18">
                                            <img
                                                src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/f8dfaf95-99de-48aa-a1c8-b07b1ab2f17c"}
                                                className="image15"
                                            />
                                            <span className="text33" >
												{"Buyer review notifications"}
											</span>
                                        </div>
                                        <div className="row-view18">
                                            <img
                                                src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/cba84a8a-3acb-4e37-98a0-b8fd62457a43"}
                                                className="image15"
                                            />
                                            <span className="text34" >
												{"Rating reminders notifications"}
											</span>
                                        </div>
                                        <div className="row-view18">
                                            <img
                                                src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/9b818ce1-17fa-449c-80db-ec89c1bfe9e4"}
                                                className="image15"
                                            />
                                            <span className="text35" >
												{"Meetups near you notifications"}
											</span>
                                        </div>
                                        <div className="row-view18">
                                            <img
                                                src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/b3c87455-caf8-40e3-a343-6dce1438390e"}
                                                className="image15"
                                            />
                                            <span className="text36" >
												{"Company news notifications"}
											</span>
                                        </div>
                                        <div className="row-view18">
                                            <img
                                                src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/91c7293f-a5fb-4af5-8363-6b5a549e1dcb"}
                                                className="image15"
                                            />
                                            <span className="text37" >
												{"New launches and projects"}
											</span>
                                        </div>
                                        <div className="row-view18">
                                            <img
                                                src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/99b6fbf2-fa7a-48a8-a60f-941852c6c315"}
                                                className="image15"
                                            />
                                            <span className="text33" >
												{"Monthly product changes"}
											</span>
                                        </div>
                                        <div className="row-view18">
                                            <img
                                                src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/27a78237-bd1f-44f6-8037-13ac7b2a11d5"}
                                                className="image15"
                                            />
                                            <span className="text38" >
												{"Subscribe to newsletter"}
											</span>
                                        </div>
                                        <div className="row-view4">
                                            <img
                                                src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/5193a8df-145d-4ba9-9e6e-c3add42e3c12"}
                                                className="image15"
                                            />
                                            <span className="text39" >
												{"Email me when someone follows me"}
											</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row-view19">
							<span className="text40" >
								{"© 2022 Horizon UI. All Rights Reserved. Made with love by Simmmple!"}
							</span>
                            <span className="text41" >
								{"Marketplace"}
							</span>
                            <span className="text42" >
								{"License"}
							</span>
                            <span className="text43" >
								{"Terms of Use"}
							</span>
                            <span className="text44" >
								{"Blog"}
							</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}