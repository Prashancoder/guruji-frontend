  import React, { Fragment, useEffect, useState } from "react";
  import { useSelector, useDispatch } from "react-redux";
  import {
    clearErrors,
    updateService,
    getServiceDetails,
  } from "../../actions/serviceAction";
  import { useAlert } from "react-alert";
  import { Button } from "@material-ui/core";
  import MetaData from "../layout/MetaData";
  import DescriptionIcon from "@material-ui/icons/Description";
  import SpellcheckIcon from "@material-ui/icons/Spellcheck";
  import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
  import SideBar from "./Sidebar";
  import { UPDATE_SERVICE_RESET } from "../../constants/serviceConstants";
  import { useNavigate, useParams } from "react-router-dom";

  const UpdateService = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    const { id: serviceId } = useParams();

    const { error, service } = useSelector((state) => state.serviceDetails);

    const {
      loading,
      error: updateError,
      isUpdated,
    } = useSelector((state) => state.service);

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    useEffect(() => {
      if (!service || service._id !== serviceId) {
        dispatch(getServiceDetails(serviceId));
      } else {
        setName(service.name || "");
        setDescription(service.description || "");
        setPrice(service.price || 0);
        setOldImages(service.images || []);
      }

      if (error) {
        alert.error(error);
        dispatch(clearErrors());
      }

      if (updateError) {
        alert.error(updateError);
        dispatch(clearErrors());
      }

      if (isUpdated) {
        alert.success("Service Updated Successfully");
        navigate("/admin/services");
        dispatch({ type: UPDATE_SERVICE_RESET });
      }
    }, [
      dispatch,
      alert,
      error,
      isUpdated,
      serviceId,
      service,
      updateError,
      navigate,
    ]);

    const updateServiceSubmitHandler = (e) => {
      e.preventDefault();
      alert.success("Service Updated Successfully");


      const myForm = new FormData();
      myForm.set("name", name);
      myForm.set("price", price);
      myForm.set("description", description);

      images.forEach((image) => {
        myForm.append("images", image);
      });

      dispatch(updateService(serviceId, myForm));
    };

    const updateServiceImagesChange = (e) => {
      const files = Array.from(e.target.files);

      setImages([]);
      setImagesPreview([]);
      setOldImages([]);

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.readyState === 2) {
            setImagesPreview((old) => [...old, reader.result]);
            setImages((old) => [...old, reader.result]);
          }
        };
        reader.readAsDataURL(file);
      });
    };

    return (
      <Fragment>
        <MetaData title="Update Service" />
        <div className="dashboard">
          <SideBar />
          <div className="newServiceContainer">
            <form
              className="createServiceForm"
              encType="multipart/form-data"
              onSubmit={updateServiceSubmitHandler}
            >
              <h1>Update Service</h1>

              <div>
                <SpellcheckIcon />
                <input
                  type="text"
                  placeholder="Service Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <AttachMoneyIcon />
                <input
                  type="number"
                  placeholder="Price"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div>
                <DescriptionIcon />
                <textarea
                  placeholder="Service Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  cols="30"
                  rows="1"
                ></textarea>
              </div>

              <div id="createServiceFormFile">
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={updateServiceImagesChange}
                  multiple
                />
              </div>

              <div id="createServiceFormImage">
                {oldImages &&
                  oldImages.map((image, index) => (
                    <img key={index} src={image.url} alt="Old Service Preview" />
                  ))}
              </div>

              <div id="createServiceFormImage">
                {imagesPreview.map((image, index) => (
                  <img key={index} src={image} alt="New Preview" />
                ))}
              </div>

              <Button
                id="createServiceBtn"
                type="submit"
                disabled={loading ? true : false}
              >
                Update
              </Button>
            </form>
          </div>
        </div>
      </Fragment>
    );
  };

  export default UpdateService;
