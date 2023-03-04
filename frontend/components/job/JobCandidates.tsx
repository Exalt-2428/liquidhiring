import React from "react";

import DataTable from "react-data-table-component";

const JobCandidates = ({ candidatesApplied }) => {
  const columns = [
    {
      name: "Job Name",
      sortable: true,
      selector: (row) => row.title,
    },
    {
      name: "User ID",
      sortable: true,
      selector: (row) => row.id,
    },
    {
      name: "Candidate Resume",
      sortable: true,
      selector: (row) => row.resume,
    },
    {
      name: "Applied At",
      sortable: true,
      selector: (row) => row.appliedAt,
    },
  ];

  const data = [];

  candidatesApplied &&
    candidatesApplied.forEach((item) => {
      data.push({
        title: item.job.title,
        id: item.user,
        salary: item.salary,
        resume: (
          <a href={`https://LiquidHiring.s3.amazonaws.com/${item.resume}`} target="_blank" rel="noreferrer">
            <div
              className="text-success text-center ml-4"
            >
              <b>
                <i aria-hidden className="fas fa-download"></i> View Resume
              </b>
            </div>
          </a>
        ),
        appliedAt: item.appliedAt.substring(0, 10),
      });
    });

  return (
    <div className="row">
      <div className="col-2"></div>
      <div className="col-8 mt-5">
        <h4 className="my-5">
          {candidatesApplied &&
            `${candidatesApplied.length} Candidates applied to this job`}
        </h4>
        <DataTable columns={columns} data={data} pagination responsive />
      </div>
      <div className="col-2"></div>
    </div>
  );
};

export default JobCandidates;
