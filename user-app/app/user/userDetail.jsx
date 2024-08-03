// app/user/UserDetailsModal.jsx
import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, Button, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Style from "./user.module.css";
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";

const UserDetailsModal = ({ open, onClose, id }) => {
    const [detailData, setDetailData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const fetchDetail = async (id) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/user-detail?_id=${id}`);
            setDetailData(response?.data);
        } catch (error) {
            console.error("Error fetching user details", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (id) {
            fetchDetail(id);
        }
    }, [id]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle className={Style.detail_heading}>
                <div>User Details</div>
                <Button onClick={onClose}>
                    <CloseIcon />
                </Button>
            </DialogTitle>
            <hr />
            <DialogContent className={Style.detail_data}>
                {isLoading ? (
                    <div className={Style.loader}>
                        <CircularProgress />
                    </div>
                ) : (
                    <>
                        <div className={Style.img_div}>
                            <PersonIcon />
                        </div>
                        <div>
                            <div className={Style.userDetail}>
                                <h5>Name:</h5>
                                <h6>{detailData?.name}</h6>
                            </div>
                            <div className={Style.userDetail}>
                                <h5>Email:</h5>
                                <h6>{detailData?.email}</h6>
                            </div>
                            <div className={Style.userDetail}>
                                <h5>Mobile:</h5>
                                <h6>{detailData?.mobile}</h6>
                            </div>
                            <div className={Style.userDetail}>
                                <h5>Age:</h5>
                                <h6>{detailData?.age}</h6>
                            </div>
                            <div className={Style.userDetail2}>
                                <h5>Interests:</h5>
                                <h6 className={Style.interest}>
                                    {detailData?.interest?.map((interest, index) => (
                                        <div className={Style.badge} key={index}>{interest}</div>
                                    ))}
                                </h6>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default UserDetailsModal;
