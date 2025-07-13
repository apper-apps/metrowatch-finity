import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import SearchBar from "@/components/molecules/SearchBar";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import { incidentService } from "@/services/api/incidentService";
import { format } from "date-fns";

const IncidentTable = () => {
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");

  useEffect(() => {
    loadIncidents();
  }, []);

  useEffect(() => {
    filterIncidents();
  }, [incidents, searchTerm, typeFilter, severityFilter]);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await incidentService.getAll();
      setIncidents(data);
    } catch (err) {
      setError("Failed to load incidents");
    } finally {
      setLoading(false);
    }
  };

  const filterIncidents = () => {
    let filtered = incidents;

    if (searchTerm) {
      filtered = filtered.filter(incident =>
        incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter(incident => incident.type === typeFilter);
    }

    if (severityFilter) {
      filtered = filtered.filter(incident => incident.severity === severityFilter);
    }

    setFilteredIncidents(filtered);
  };

  const resolveIncident = async (incidentId) => {
    try {
      await incidentService.update(incidentId, { resolved: true });
      setIncidents(incidents.map(incident =>
        incident.Id === incidentId ? { ...incident, resolved: true } : incident
      ));
      toast.success("Incident resolved");
    } catch (err) {
      toast.error("Failed to resolve incident");
    }
  };

  const getSeverityVariant = (severity) => {
    const variants = {
      low: "info",
      medium: "warning",
      high: "error",
      critical: "critical"
    };
    return variants[severity] || "default";
  };

  const typeOptions = [
    { value: "suspicious_object", label: "Suspicious Object" },
    { value: "unauthorized_access", label: "Unauthorized Access" },
    { value: "theft", label: "Theft" },
    { value: "crowd_density", label: "Crowd Density" },
    { value: "violence", label: "Violence" }
  ];

  const severityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" }
  ];

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadIncidents} type="system" />;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search incidents..."
          className="flex-1"
        />
        <FilterDropdown
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          options={typeOptions}
          placeholder="All Types"
          className="w-full sm:w-48"
        />
        <FilterDropdown
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          options={severityOptions}
          placeholder="All Severities"
          className="w-full sm:w-48"
        />
      </div>

      {/* Table */}
      {filteredIncidents.length === 0 ? (
        <Empty type="incidents" action={loadIncidents} />
      ) : (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Incident
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Camera
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredIncidents.map((incident, index) => (
                  <motion.tr
                    key={incident.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-background/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg flex items-center justify-center mr-3">
                          <ApperIcon name="AlertTriangle" size={16} className="text-accent" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-text-primary">
                            {incident.description}
                          </div>
                          <div className="text-sm text-text-muted">
                            ID: {incident.Id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-primary capitalize">
                        {incident.type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getSeverityVariant(incident.severity)}>
                        {incident.severity.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-primary">
{incident.camera_id}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {format(new Date(incident.timestamp), "MMM dd, HH:mm")}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={incident.resolved ? "success" : "warning"}>
                        {incident.resolved ? "Resolved" : "Active"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info("Opening incident details...")}
                        >
                          <ApperIcon name="Eye" size={14} />
                        </Button>
                        {!incident.resolved && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => resolveIncident(incident.Id)}
                          >
                            <ApperIcon name="Check" size={14} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentTable;