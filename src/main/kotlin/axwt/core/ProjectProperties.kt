package axwt.core

import java.io.IOException
import java.util.*

object ProjectProperties {

    private val properties: Properties by lazy {
        val properties = Properties()

        try {
            val inputStream = ProjectProperties::class.java.getResourceAsStream("/project.properties")
            properties.load(inputStream)
        } catch(ex: IOException) {
            System.err.println("Failed to load '/project.properties' due to: "+ex.message)
        }

        properties
    }

    operator fun get(key: String): String = properties.getProperty(key) ?: throw MissingPropertyException(key)

    val displayName = get("display_name")
    val version = get("maven_version")
    val buildDate = get("build_date")

}

class MissingPropertyException(key: String): RuntimeException("Missing property: '$key'")