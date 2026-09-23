import './upload.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Upload() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        resourceType: '',
        title: '',
        author: '',
        subject: '',
        category: '',
        description: '',
        academicYear: '',
        semester: '',
        institution: '',
        condition: '',
        yearsUsed: '',
        originalPrice: '',
        listingType: 'free',
        expectedPrice: '',
        file: null
    });

    const physicalResourceTypes = [
        'Book',
        'Lab Manual',
        'Project Material'
    ];

    const questionPaperTypes = [
        'Question Paper',
        'Previous Year Papers'
    ];

    const isPhysicalResource =
        physicalResourceTypes.includes(formData.resourceType);

    const isQuestionPaper =
        questionPaperTypes.includes(formData.resourceType);


    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    const handleFileChange = (e) => {

        setFormData((prev) => ({
            ...prev,
            file: e.target.files[0]
        }));

    };


    const handleSubmit = (e) => {

        e.preventDefault();

        console.log(formData);

        // Backend API will be connected here

        alert('Resource submitted successfully!');

    };


    return (

        <div className="upload-overlay">

            <div className="upload-box">

                <div className="upload-header">

                    <button
                        className="close-btn"
                        onClick={() => navigate('/')}
                    >
                        x
                    </button>

                    <h2>Share Educational Resource</h2>

                </div>


                <form onSubmit={handleSubmit}>

                    {/* RESOURCE TYPE */}

                    <div className="form-row">

                        <label htmlFor="resourceType">
                            Resource Type:
                        </label>

                        <select
                            id="resourceType"
                            name="resourceType"
                            value={formData.resourceType}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select resource type
                            </option>

                            <option value="Book">
                                Book
                            </option>

                            <option value="Notes">
                                Notes
                            </option>

                            <option value="Study Material">
                                Study Material
                            </option>

                            <option value="Question Paper">
                                Question Paper
                            </option>

                            <option value="Previous Year Papers">
                                Previous Year Papers
                            </option>

                            <option value="Lab Manual">
                                Lab Manual
                            </option>

                            <option value="Project Material">
                                Project Material
                            </option>

                            <option value="Assignment">
                                Assignment
                            </option>

                            <option value="Presentation">
                                Presentation
                            </option>

                            <option value="Reference Material">
                                Reference Material
                            </option>

                            <option value="Other">
                                Other
                            </option>

                        </select>

                    </div>


                    {/* TITLE */}

                    <div className="form-row">

                        <label htmlFor="title">
                            Title:
                        </label>

                        <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder="Enter resource title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* AUTHOR - ONLY BOOK */}

                    {formData.resourceType === 'Book' && (

                        <div className="form-row">

                            <label htmlFor="author">
                                Author:
                            </label>

                            <input
                                type="text"
                                id="author"
                                name="author"
                                placeholder="Enter author name"
                                value={formData.author}
                                onChange={handleChange}
                            />

                        </div>

                    )}


                    {/* SUBJECT */}

                    <div className="form-row">

                        <label htmlFor="subject">
                            Subject:
                        </label>

                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            placeholder="e.g. Data Structures"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* CATEGORY */}

                    <div className="form-row">

                        <label htmlFor="category">
                            Category:
                        </label>

                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Category
                            </option>

                            <option value="Computer Science">
                                Computer Science
                            </option>

                            <option value="Engineering">
                                Engineering
                            </option>

                            <option value="Mathematics">
                                Mathematics
                            </option>

                            <option value="Physics">
                                Physics
                            </option>

                            <option value="Chemistry">
                                Chemistry
                            </option>

                            <option value="Biology">
                                Biology
                            </option>

                            <option value="Management">
                                Management
                            </option>

                            <option value="Commerce">
                                Commerce
                            </option>

                            <option value="Competitive Exams">
                                Competitive Exams
                            </option>

                            <option value="School Education">
                                School Education
                            </option>

                            <option value="Research">
                                Research
                            </option>

                            <option value="Other">
                                Other
                            </option>

                        </select>

                    </div>


                    {/* DESCRIPTION */}

                    <div className="form-row">

                        <label htmlFor="description">
                            Description:
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            placeholder="Describe the resource..."
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            required
                        />

                    </div>


                    {/* QUESTION PAPER DETAILS */}

                    {isQuestionPaper && (

                        <>

                            <h3 className="section-title">
                                Academic Details
                            </h3>


                            <div className="form-row">

                                <label htmlFor="academicYear">
                                    Academic Year:
                                </label>

                                <input
                                    type="text"
                                    id="academicYear"
                                    name="academicYear"
                                    placeholder="2025-2026"
                                    value={formData.academicYear}
                                    onChange={handleChange}
                                />

                            </div>


                            <div className="form-row">

                                <label htmlFor="semester">
                                    Semester:
                                </label>

                                <select
                                    id="semester"
                                    name="semester"
                                    value={formData.semester}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        Select Semester
                                    </option>

                                    <option value="1">
                                        Semester 1
                                    </option>

                                    <option value="2">
                                        Semester 2
                                    </option>

                                    <option value="3">
                                        Semester 3
                                    </option>

                                    <option value="4">
                                        Semester 4
                                    </option>

                                    <option value="5">
                                        Semester 5
                                    </option>

                                    <option value="6">
                                        Semester 6
                                    </option>

                                    <option value="7">
                                        Semester 7
                                    </option>

                                    <option value="8">
                                        Semester 8
                                    </option>

                                </select>

                            </div>


                            <div className="form-row">

                                <label htmlFor="institution">
                                    Institution:
                                </label>

                                <input
                                    type="text"
                                    id="institution"
                                    name="institution"
                                    placeholder="Enter college/university"
                                    value={formData.institution}
                                    onChange={handleChange}
                                />

                            </div>

                        </>

                    )}


                    {/* PHYSICAL RESOURCE DETAILS */}

                    {isPhysicalResource && (

                        <>

                            <h3 className="section-title">
                                Physical Resource Details
                            </h3>


                            <div className="form-row">

                                <label htmlFor="condition">
                                    Condition:
                                </label>

                                <select
                                    id="condition"
                                    name="condition"
                                    value={formData.condition}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        Select Condition
                                    </option>

                                    <option value="New">
                                        New
                                    </option>

                                    <option value="Like New">
                                        Like New
                                    </option>

                                    <option value="Good">
                                        Good
                                    </option>

                                    <option value="Fair">
                                        Fair
                                    </option>

                                    <option value="Used">
                                        Used
                                    </option>

                                </select>

                            </div>


                            <div className="form-row">

                                <label htmlFor="yearsUsed">
                                    Years Used:
                                </label>

                                <input
                                    type="number"
                                    id="yearsUsed"
                                    name="yearsUsed"
                                    min="0"
                                    step="0.5"
                                    placeholder="e.g. 2"
                                    value={formData.yearsUsed}
                                    onChange={handleChange}
                                />

                            </div>


                            <div className="form-row">

                                <label htmlFor="originalPrice">
                                    Original Price:
                                </label>

                                <input
                                    type="number"
                                    id="originalPrice"
                                    name="originalPrice"
                                    min="0"
                                    placeholder="₹800"
                                    value={formData.originalPrice}
                                    onChange={handleChange}
                                />

                            </div>


                            {/* FREE OR SELL */}

                            <div className="form-row">

                                <label>
                                    Listing Type:
                                </label>

                                <div className="listing-options">

                                    <label>

                                        <input
                                            type="radio"
                                            name="listingType"
                                            value="free"
                                            checked={
                                                formData.listingType === 'free'
                                            }
                                            onChange={handleChange}
                                        />

                                        Free

                                    </label>


                                    <label>

                                        <input
                                            type="radio"
                                            name="listingType"
                                            value="sale"
                                            checked={
                                                formData.listingType === 'sale'
                                            }
                                            onChange={handleChange}
                                        />

                                        Sell

                                    </label>

                                </div>

                            </div>


                            {/* EXPECTED PRICE */}

                            {formData.listingType === 'sale' && (

                                <div className="form-row">

                                    <label htmlFor="expectedPrice">
                                        Expected Price:
                                    </label>

                                    <input
                                        type="number"
                                        id="expectedPrice"
                                        name="expectedPrice"
                                        min="0"
                                        placeholder="₹500"
                                        value={formData.expectedPrice}
                                        onChange={handleChange}
                                    />

                                </div>

                            )}

                        </>

                    )}


                    {/* FILE */}

                    <div className="form-row">

                        <label htmlFor="file">
                            Upload File:
                        </label>

                        <input
                            type="file"
                            id="file"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="upload-btn"
                    >
                        Share Resource
                    </button>

                </form>

            </div>

        </div>

    );
}