import { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Slider from "@mui/material/Slider";
import { Chart } from "react-google-charts";
import Dropdown from "react-bootstrap/Dropdown";
import Col from "react-bootstrap/Col";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Arrow from "@mui/icons-material/NoteAltOutlined";
import ListItemText from "@mui/material/ListItemText";
import axios from "axios";
import backendServer from "../../webConfig";
import TextField from "@mui/material/TextField";
import { useSelector, useDispatch } from "react-redux";
import Annotation from "../common/Annotations";
const years = [
  {
    value: 0,
    label: "1960",
  },
  {
    value: 15,
    label: "1970",
  },
  {
    value: 30,
    label: "1980",
  },
  {
    value: 45,
    label: "1990",
  },

  {
    value: 60,
    label: "2000",
  },

  {
    value: 75,
    label: "2010",
  },
  {
    value: 90,
    label: "2020",
  },
];
function valuetext(value) {
  return `${value}`;
}

function Agriculture(props) {
  const [page, setPage] = useState("Agriculture");
  const [year, setYear] = useState([]);
  const [val, setVal] = useState([]);
  const [startDate, setStartDate] = useState(1960);
  const [endDate, setEndDate] = useState(2020);
  const [graphData, setGraphData] = useState([]);
  const [value2, setValue2] = useState([0, 15]);
  const [annotations, setAnnotations] = useState([]);
  const minDistance = 15;
  const country = useSelector((state) => state.userInfo.country);
  const disableAnno = useSelector((state) => state.userInfo.disableAnno);
  const handleChange2 = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        setValue2([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setValue2([clamped - minDistance, clamped]);
      }
    } else {
      setValue2(newValue);
      setStartDate(years.find((p) => p.value === value2[0]).label);
      setEndDate(years.find((p) => p.value === value2[1]).label);
    }
  };
  const addAnnotations = (e) => {
    let val = document.getElementById("outlined-textarea");
    let arr = annotations.map((an) => {
      return an;
    });
    arr.push(val.value);
    setAnnotations(arr);
  };
  const options = {
    hAxis: {
      format: "",
    },
  };
  useEffect(() => {
    axios
      .get(
        `${backendServer}/agri/getFileData/` +
          startDate +
          "/" +
          endDate +
          "/agriculture" +
          "/" +
          country
      )
      .then((res) => {
        if (res.status == 200) {
          let recs = res.data;
          let yearArr = [];
          let valArr = [];
          // for(let i=0;i<recs.length;i++) {
          //     let rec = recs[i];
          //     yearArr.push(parseInt(rec.Year));
          //     let v = rec.val==null || isNaN(rec.val)?0:rec.val;
          //     valArr.push(parseFloat(v));
          // }
          // setYear(yearArr);
          // setVal(valArr);

          let fv = [["Year", "Agriculture GDP"]];
          for (let i = 0; i < recs.length; i++) {
            fv.push(recs[i]);
          }
          // }
          console.log("year arr", fv);
          setGraphData(fv);
        }
      });
  }, [startDate, endDate, country]);
  return (
    <>
      {/* <div>
        <select name="user" id="user-select">
          <option value="Govt">Government Representive</option>
          <option value="Researcher">Researcher</option>
        </select>
      </div> */}
      &nbsp;
      <Card>
        <Card.Body>
          <Row>
            <label style={{ "font-weight": "bold" }}>Year</label>
            <Slider
              getAriaLabel={() => "Minimum distance shift"}
              value={value2}
              label={valuetext}
              onChange={handleChange2}
              valueLabelDisplay="auto"
              step="15"
              getAriaValueText={valuetext}
              disableSwap
              marks={years}
            />
          </Row>
        </Card.Body>
      </Card>
      &nbsp;
      <Card>
        <Card.Body>
          <Row>
            <Col md={8}>
              <label style={{ "font-weight": "bold" }}>
                Agriculture(%GDP)
              </label>
              <Chart
                chartType="LineChart"
                data={graphData}
                width="100%"
                height="400px"
                legendToggle
                options={options}
              />
            </Col>
            <Col md={4} hidden={disableAnno}>
             <Annotation currentPage="agriculture" />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}
export default Agriculture;
