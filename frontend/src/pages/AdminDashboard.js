import React, {useState} from "react";
import "../styles/Admin.css"
export default (props) => {
    const [input1, onChangeInput1] = useState('');
    const [input2, onChangeInput2] = useState('');
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
                                    src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/76c6c27c-f302-4eb0-a082-7591f8751d74"}
                                    className="image"
                                />
                                <span className="text2" >
									{"Dashboard"}
								</span>
                            </div>
                            <div className="row-view3">
                                <img
                                    src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/85efb97f-aed4-473f-a904-cc49090afefa"}
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
                                    src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/5b8c7a53-4a54-4fb3-abd0-c4ee71503f8c"}
                                    className="image3"
                                />
                                <span className="text4" >
									{"Leave Requests"}
								</span>
                            </div>
                        </div>
                    </div>
                    <div className="column4">
                        <div className="row-view5">
                            <div className="column5">
								<span className="text5" >
									{"Pages / Dashboard"}
								</span>
                                <span className="text6" >
									{"Main Dashboard"}
								</span>
                            </div>
                            <div className="row-view6">
                                <img
                                    src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/a90cbc2d-5cad-46bb-905e-42cd99e48e33"}
                                    className="image4"
                                />
                                <span className="text7" >
									{"Doe, Jane"}
								</span>
                                <img
                                    src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/d159726d-1397-4859-82be-d815159c2e67"}
                                    className="image5"
                                />
                            </div>
                        </div>
                        <div className="row-view7">
                            <div className="row-view8">
                                <img
                                    src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/de4aa923-97df-4b07-bc38-65c63102ab7d"}
                                    className="image6"
                                />
                                <div className="column3">
									<span className="text8" >
										{"Earnings"}
									</span>
                                    <span className="text9" >
										{"$350.4"}
									</span>
                                </div>
                            </div>
                            <div className="row-view8">
                                <img
                                    src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/2c2adbd4-e1d2-472f-8ad3-185e435a9eaf"}
                                    className="image6"
                                />
                                <div className="column3">
									<span className="text8" >
										{"Spend this month"}
									</span>
                                    <span className="text9" >
										{"$642.39"}
									</span>
                                </div>
                            </div>
                            <div className="column6">
								<span className="text10" >
									{"Sales"}
								</span>
                                <span className="text11" >
									{"$574.34"}
								</span>
                                <div className="row-view9">
									<span className="text12" >
										{"+23%"}
									</span>
                                    <span className="text13" >
										{"since last month"}
									</span>
                                </div>
                            </div>
                            <div className="row-view10">
                                <div className="column7">
									<span className="text14" >
										{"Your balance"}
									</span>
                                    <span className="text9" >
										{"$1,000"}
									</span>
                                </div>
                                <img
                                    src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/9200c0f3-ccf2-4980-879f-3f9cdbae1a46"}
                                    className="image7"
                                />
                            </div>
                            <div className="row-view8">
                                <img
                                    src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/b50fb573-3aac-4a03-8e81-d79f20734b87"}
                                    className="image6"
                                />
                                <div className="column3">
									<span className="text15" >
										{"New Tasks"}
									</span>
                                    <span className="text16" >
										{"154"}
									</span>
                                </div>
                            </div>
                            <div className="row-view11">
                                <img
                                    src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/4de52217-ae03-4860-b3e6-0705c49d9946"}
                                    className="image6"
                                />
                                <div className="column3">
									<span className="text8" >
										{"Total Projects"}
									</span>
                                    <span className="text9" >
										{"2935"}
									</span>
                                </div>
                            </div>
                        </div>
                        <div className="row-view4">
                            <div className="column8">
                                <div className="row-view12">
                                    <div className="column9">
                                        <div className="column10">
                                            <div className="view">
                                                <div className="row-view13">
                                                    <input
                                                        placeholder={"March"}
                                                        value={input1}
                                                        onChange={(event)=>onChangeInput1(event.target.value)}
                                                        className="input"
                                                    />
                                                    <img
                                                        src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/ec07989c-c9f2-4040-a74a-54906848fd5d"}
                                                        className="image8"
                                                    />
                                                </div>
                                            </div>
                                            <span className="text17" >
												{"Projects"}
											</span>
                                        </div>
                                        <div className="row-view14">
											<span className="text18" >
												{"DONE"}
											</span>
                                            <span className="text15" >
												{"ONGOING"}
											</span>
                                        </div>
                                        <div className="row-view15">
                                            <div className="row-view16">
												<span className="text19" >
													{"36"}
												</span>
                                                <img
                                                    src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/2bbd0e6c-893d-4f88-92f5-3e0c93f4ab2d"}
                                                    className="image9"
                                                />
                                            </div>
                                            <div className="row-view17">
												<span className="text20" >
													{"12"}
												</span>
                                                <img
                                                    src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/f03deed5-1be3-402c-838d-57a50cc27dca"}
                                                    className="image9"
                                                />
                                            </div>
                                        </div>
                                        <div className="row-view18">
											<span className="text21" >
												{"CANCEL"}
											</span>
                                            <span className="text15" >
												{"UPCOMING"}
											</span>
                                        </div>
                                        <div className="row-view19">
                                            <div className="row-view20">
												<span className="text22" >
													{"3"}
												</span>
                                                <img
                                                    src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/5bdf727d-82a9-425c-82cd-273d460aa141"}
                                                    className="image9"
                                                />
                                            </div>
                                            <div className="row-view17">
												<span className="text23" >
													{"4"}
												</span>
                                                <img
                                                    src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/13a8f9d2-e361-4f92-a2ec-98fe2a3869d8"}
                                                    className="image9"
                                                />
                                            </div>
                                        </div>
                                        <div className="row-view21">
											<span className="text24" >
												{"See details"}
											</span>
                                            <img
                                                src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/d8c12512-f744-40b1-b02f-bf307f025c9e"}
                                                className="image8"
                                            />
                                        </div>
                                    </div>
                                    <div className="column11">
                                        <div className="column12">
											<span className="text25" >
												{"Payrolls"}
											</span>
                                            <span className="text26" >
												{"Due Date"}
											</span>
                                            <span className="text27" >
												{"APR 05"}
											</span>
                                        </div>
                                        <div className="column13"
                                             style={{
                                                 backgroundImage: 'url(https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/582a878f-a229-4093-b911-d8ad32b3f11a)',
                                             }}
                                        >
											<span className="text28" >
												{"$2400"}
											</span>
                                            <div className="row-view22">
												<span className="text29" >
													{"View details"}
												</span>
                                                <img
                                                    src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/be5cbc99-afa2-4d68-a1f7-cc5e5104604d"}
                                                    className="image8"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row-view23">
                                    <div className="column14">
										<span className="text30" >
											{"27 March"}
										</span>
                                        <div className="row-view24">
                                            <div className="box4">
                                            </div>
                                            <div className="column3">
												<span className="text31" >
													{"Meet w/ Simmmple"}
												</span>
                                                <span className="text32" >
													{"01:00 PM - 02:00 PM"}
												</span>
                                            </div>
                                        </div>
                                        <div className="row-view25">
                                            <div className="box4">
                                            </div>
                                            <div className="column15">
												<span className="text33" >
													{"Fitness Training"}
												</span>
                                                <span className="text34" >
													{"02:00 PM - 03:00 PM"}
												</span>
                                            </div>
                                        </div>
                                        <div className="view">
                                            <div className="row-view26">
												<span className="text35" >
													{"View all Tasks"}
												</span>
                                                <img
                                                    src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/c1801a87-04b2-4ddd-8ca2-69579394b1f1"}
                                                    className="image8"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column16">
                                        <div className="row-view27">
											<span className="text36" >
												{"Check-in"}
											</span>
                                            <div className="box5">
                                            </div>
                                        </div>
                                        <div className="column17">
											<span className="text37" >
												{"Check-out"}
											</span>
                                            <div className="box6">
                                            </div>
                                        </div>
                                        <span className="text38" >
											{"Checked-in: 08:30:44"}
										</span>
                                        <span className="text39" >
											{"Checked-out: 16:23:19"}
										</span>
                                    </div>
                                </div>
                                <div className="column18">
                                    <div className="row-view28">
										<span className="text40" >
											{"Performance"}
										</span>
                                        <button className="button-row-view"
                                                onClick={()=>alert("Pressed!")}>
                                            <img
                                                src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/28709b10-5043-4026-bf60-26bfa678198b"}
                                                className="image10"
                                            />
                                            <span className="text41" >
												{"This month"}
											</span>
                                        </button>
                                        <button className="button"
                                                onClick={()=>alert("Pressed!")}>
                                            <img
                                                src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/176d7134-2167-477c-a331-211f763fffba"}
                                                className="image11"
                                            />
                                        </button>
                                    </div>
                                    <img
                                        src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/1fda0538-74ad-4abb-8c96-cb611ee02498"}
                                        className="image12"
                                    />
                                    <div className="row-view29">
										<span className="text42" >
											{"SEP"}
										</span>
                                        <span className="text42" >
											{"OCT"}
										</span>
                                        <span className="text42" >
											{"NOV"}
										</span>
                                        <span className="text42" >
											{"DEC"}
										</span>
                                        <span className="text42" >
											{"JAN"}
										</span>
                                        <span className="text43" >
											{"FEB"}
										</span>
                                    </div>
                                </div>
                            </div>
                            <div className="column19">
                                <div className="row-view30">
                                    <div className="row-view4">
                                        <img
                                            src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/3ae77ae8-6b5e-4083-9289-173d12681ff0"}
                                            className="image13"
                                        />
                                        <span className="text44" >
											{"Tasks"}
										</span>
                                    </div>
                                    <div className="box7">
                                    </div>
                                    <button className="button2"
                                            onClick={()=>alert("Pressed!")}>
                                        <img
                                            src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/d68ed34a-52b7-471c-b51f-874f548ba1f3"}
                                            className="image8"
                                        />
                                    </button>
                                </div>
                                <div className="row-view31">
                                    <img
                                        src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/2af73de2-4019-4046-9cc8-6abfd79d1553"}
                                        className="image14"
                                    />
                                    <span className="text45" >
										{"Landing Page Design"}
									</span>
                                    <img
                                        src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/3d4f99f4-7ae2-41cd-ad47-5e359a08086a"}
                                        className="image8"
                                    />
                                </div>
                                <div className="row-view31">
                                    <img
                                        src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/b422d181-ec34-4eb0-bb4e-79c190cb8599"}
                                        className="image14"
                                    />
                                    <span className="text46" >
										{"Dashboard Builder"}
									</span>
                                    <img
                                        src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/d0d027ec-fe37-40ac-b58d-2006e1d0990b"}
                                        className="image8"
                                    />
                                </div>
                                <div className="row-view31">
                                    <img
                                        src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e7eb122c-c774-40a7-b169-61aad5dbe065"}
                                        className="image14"
                                    />
                                    <span className="text47" >
										{"Mobile App Design"}
									</span>
                                    <img
                                        src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/583f7bfd-b01c-4b7b-8415-18ab6f0fe2ee"}
                                        className="image8"
                                    />
                                </div>
                                <div className="row-view31">
                                    <img
                                        src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/b417c657-34c8-4254-a3b4-5c78590f90b9"}
                                        className="image14"
                                    />
                                    <span className="text48" >
										{"Illustrations"}
									</span>
                                    <img
                                        src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/c5cddf56-cd98-481e-a5ae-f9c3b63ddbb9"}
                                        className="image8"
                                    />
                                </div>
                                <div className="row-view32">
                                    <img
                                        src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/9cff30f8-044a-43fc-bd0e-e5f017ed4471"}
                                        className="image14"
                                    />
                                    <span className="text49" >
										{"Promotional LP"}
									</span>
                                    <img
                                        src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/fd9134f4-3516-4c0b-bdf2-2966fa6c7d12"}
                                        className="image8"
                                    />
                                </div>
                            </div>
                            <div className="column3">
                                <div className="column20">
                                    <div className="row-view33">
                                        <div className="row-view34">
                                            <input
                                                placeholder={"Mar 27, Thursday"}
                                                value={input2}
                                                onChange={(event)=>onChangeInput2(event.target.value)}
                                                className="input2"
                                            />
                                            <img
                                                src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/b672d970-3481-4994-bee6-c693bd2c44a8"}
                                                className="image8"
                                            />
                                        </div>
                                        <div className="row-view35">
											<span className="text50" >
												{"2025"}
											</span>
                                            <img
                                                src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/77e68581-67da-4191-b761-eceac8b130fb"}
                                                className="image8"
                                            />
                                        </div>
                                    </div>
                                    <div className="row-view36">
                                        <div className="column21">
											<span className="text51" >
												{"Mo"}
											</span>
                                            <span className="text52" >
												{"29"}
											</span>
                                            <span className="text53" >
												{"5"}
											</span>
                                            <span className="text53" >
												{"12"}
											</span>
                                            <span className="text53" >
												{"19"}
											</span>
                                            <span className="text53" >
												{"26"}
											</span>
                                        </div>
                                        <div className="column15">
											<span className="text51" >
												{"Tu"}
											</span>
                                            <span className="text54" >
												{"30"}
											</span>
                                            <span className="text53" >
												{"6"}
											</span>
                                            <span className="text53" >
												{"13"}
											</span>
                                            <span className="text53" >
												{"20"}
											</span>
                                            <span className="text53" >
												{"27"}
											</span>
                                        </div>
                                        <div className="column21">
											<span className="text51" >
												{"We"}
											</span>
                                            <span className="text54" >
												{"31"}
											</span>
                                            <span className="text53" >
												{"7"}
											</span>
                                            <span className="text53" >
												{"14"}
											</span>
                                            <span className="text53" >
												{"21"}
											</span>
                                            <div className="view2">
                                                <div className="view3"
                                                     style={{
                                                         backgroundImage: 'url(https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/11e86fe3-640e-41cb-9c7c-16d7df1090b9)',
                                                     }}
                                                >
													<span className="text55" >
														{"28"}
													</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="column22">
											<span className="text51" >
												{"Th"}
											</span>
                                            <span className="text56" >
												{"Fri"}
											</span>
                                            <img
                                                src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/c3b2f175-d758-4706-a9cf-63316511f9a0"}
                                                className="image15"
                                            />
                                            <span className="text57" >
												{"2"}
											</span>
                                            <span className="text53" >
												{"8"}
											</span>
                                            <span className="text57" >
												{"9"}
											</span>
                                            <span className="text53" >
												{"15"}
											</span>
                                            <span className="text57" >
												{"16"}
											</span>
                                            <span className="text53" >
												{"22"}
											</span>
                                            <span className="text57" >
												{"23"}
											</span>
                                            <div className="view4">
												<span className="text58" >
													{"29"}
												</span>
                                            </div>
                                            <div className="view5">
                                                <div className="view6"
                                                     style={{
                                                         backgroundImage: 'url(https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/0ef6b60c-3221-4ce4-bef1-12fc63ecc19c)',
                                                     }}
                                                >
													<span className="text55" >
														{"30"}
													</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="column21">
											<span className="text51" >
												{"Sa"}
											</span>
                                            <span className="text53" >
												{"3"}
											</span>
                                            <span className="text53" >
												{"10"}
											</span>
                                            <span className="text53" >
												{"17"}
											</span>
                                            <span className="text53" >
												{"24"}
											</span>
                                            <span className="text54" >
												{"1"}
											</span>
                                        </div>
                                        <div className="column15">
											<span className="text51" >
												{"Su"}
											</span>
                                            <span className="text53" >
												{"4"}
											</span>
                                            <span className="text53" >
												{"11"}
											</span>
                                            <span className="text53" >
												{"18"}
											</span>
                                            <span className="text53" >
												{"25"}
											</span>
                                            <span className="text54" >
												{"2"}
											</span>
                                        </div>
                                    </div>
                                    <div className="row-view37">
										<span className="text59" >
											{"3"}
										</span>
                                        <span className="text60" >
											{"4"}
										</span>
                                        <div className="box8">
                                        </div>
                                        <span className="text59" >
											{"5"}
										</span>
                                        <span className="text59" >
											{"6"}
										</span>
                                        <span className="text59" >
											{"7"}
										</span>
                                        <span className="text59" >
											{"8"}
										</span>
                                        <span className="text60" >
											{"9"}
										</span>
                                    </div>
                                </div>
                                <div className="column23">
                                    <div className="row-view38">
										<span className="text61" >
											{"8:00"}
										</span>
                                        <div className="column24">
                                            <button className="button3"
                                                    onClick={()=>alert("Pressed!")}>
												<span className="text62" >
													{"Meeting"}
												</span>
                                            </button>
                                            <div className="absolute-box">
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text63" >
										{"8:00"}
									</span>
                                    <span className="text63" >
										{"8:00"}
									</span>
                                    <span className="text63" >
										{"8:00"}
									</span>
                                    <span className="text63" >
										{"8:00"}
									</span>
                                    <span className="text63" >
										{"8:00"}
									</span>
                                    <span className="text63" >
										{"8:00"}
									</span>
                                    <span className="text64" >
										{"8:00"}
									</span>
                                    <span className="text64" >
										{"8:00"}
									</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}