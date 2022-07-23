package axwt.core

import org.slf4j.LoggerFactory

object ApplicationOptions {
    private val logger = LoggerFactory.getLogger(this::class.java)

    const val PROPERTY_OPTS = "axwt.opts"

    val options: List<AppOpt> = run {
        val optsProperty = System.getProperty(PROPERTY_OPTS, "")

        buildList {
            for(str in optsProperty.split(",")) if(str.isNotBlank()) {
                try {
                    val opt = AppOpt.valueOf(str)
                    add(opt)
                } catch(ex: Exception) {
                    logger.warn("Unrecognised options provided to $PROPERTY_OPTS: $str")
                }
            }
        }
    }

    val scriptModeOptions: ScriptModeOptions = ScriptModeOptions.fromSystemProperties()

    operator fun contains(option: AppOpt): Boolean = options.contains(option)

    override fun toString(): String = options.joinToString(",")
}

@Suppress("EnumEntryName")
enum class AppOpt {
    DevFrontend,
    ScriptMode,
    UseHttpErrors,
}


data class ScriptModeOptions(
    val dbHost: String,
    val dbName: String,
    val dbUser: String,
    val dbPswd: String,
) {
    companion object {
        const val PROPERTY_DB_HOST = "axwt.db.host"
        const val PROPERTY_DB_NAME = "axwt.db.name"
        const val PROPERTY_DB_PSWD = "axwt.db.pswd"
        const val PROPERTY_DB_USER = "axwt.db.user"

        fun fromSystemProperties(): ScriptModeOptions =
            ScriptModeOptions(
                System.getProperty(PROPERTY_DB_HOST, "mysqlhost"),
                System.getProperty(PROPERTY_DB_NAME, "name"),
                System.getProperty(PROPERTY_DB_USER, "username"),
                System.getProperty(PROPERTY_DB_PSWD, "password"),
            )
    }
}