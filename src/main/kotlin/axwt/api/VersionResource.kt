package axwt.api

import axwt.core.ProjectProperties
import com.fasterxml.jackson.annotation.JsonProperty
import javax.ws.rs.GET
import javax.ws.rs.Path
import javax.ws.rs.Produces
import javax.ws.rs.core.MediaType

@Path("/version")
class VersionResource {

    @Produces(MediaType.APPLICATION_JSON)
    @GET fun getVersion() = VersionResponse(ProjectProperties.displayName, ProjectProperties.version)

    data class VersionResponse(
        @JsonProperty("name") val name: String,
        @JsonProperty("version") val version: String
    )
}